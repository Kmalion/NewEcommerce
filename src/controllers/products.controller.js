import productsPaginateService from '../services/products/products.paginator.service.js';
import ProductManagerService from '../services/products/products.manager.service.js';
import UserValidator from '../services/policies/roleValidationService.js';
import MailService from '../services/mailing/mailing.service.js'; 

export const productsController = async (req, res, next) => {
  try {
    // Verificar si el usuario está autenticado
    if (!req.isAuthenticated()) {
      req.flash('error', 'Debes iniciar sesión para acceder a esta página');
      return res.redirect('/'); // Ajusta la ruta según tu configuración
    }

    // Resto del código
    const Products = new ProductManagerService();
    const products = await Products.getProducts();

    const owner = products.map(product => product.owner);

    // Obtener el array isOwner
    const userProfile = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      profilePic: req.user.documents.length > 0 ? req.user.documents[0].profilePic : null,
    };
    const Validator = new UserValidator();
    const isOwnerResults = await Validator.isOwner(userProfile, products);
    const isOwner = isOwnerResults;

    // Utiliza el servicio de paginación para paginar productsWithOwnership
    const productsWithOwnership = products.map((product, index) => {
      const isOwnerProduct = isOwner[index];
      return {
        ...product,
        isOwner: isOwnerProduct,
      };
    });
    const result = await productsPaginateService(req, {
      products: productsWithOwnership,
      isOwner: isOwner, // Pasa isOwner como parte de un objeto
    });
    const isAdminOrOwner = await Validator.isUserAdminOrOwner(userProfile, owner)


    res.render('home', {
      products: result.products,
      userProfile,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      nextPage: result.nextPage,
      prevPage: result.prevPage,
      isAdmin: await Validator.validateUserRole(userProfile, 'admin'),
      isAdminOrOwner: await Validator.isUserAdminOrOwner(userProfile, owner),
      isPremium: await Validator.validateUserRole(userProfile, 'premium'),
      isOwner, // Puede ser necesario ajustar cómo se pasa isOwner según la lógica de tu paginación
    });

  } catch (error) {
    console.error('Error al obtener los productos:', error);
    next(error); // Pasa el error al siguiente middleware de manejo de errores
  }
};


export const productsCreate = async (req, res, next) => {
  try {
    const Products = new ProductManagerService();
    const ownerId = req.user.email || 'admin';

    const newProduct = {
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      thumbnail: req.body.thumbnail,
      code: req.body.code,
      status: req.body.status,
      stock: req.body.stock,
      owner: ownerId, // Asigna el ID del usuario en sesión como el propietario del producto
    };

    // Crea el nuevo producto en la base de datos
    await Products.addProduct(newProduct);
    req.flash('success_msg', 'Producto creado satisfactoriamente');
    // Redirige a la página de productos después de la creación exitosa
    res.redirect('/products');
  } catch (error) {
    console.error('Error al crear el producto:', error);
    next(error); // Pasa el error al siguiente middleware de manejo de errores
  }
};

export const productsCreateView = async (req, res, next) => {
  try {
    const ownerId = req.user.email;
    // Renderiza la plantilla y pasa el ID del usuario en sesión
    res.render('createProduct', { ownerId });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    next(error); // Pasa el error al siguiente middleware de manejo de errores
  }
};

export const deleteProductController = async (req, res, next) => {
  try {
    const productId = req.params.pid;
    const Products = new ProductManagerService();
    const products = await Products.deleteProduct(productId);
    console.log("Productos", products)

    // Obtén el propietario del producto eliminado
    const ownerEmail = products.owner; // Ajusta según la estructura de tu modelo de producto
    console.log("Owner email", ownerEmail)
    // Envía un correo electrónico al propietario informándole sobre la eliminación del producto
    const Mail = new MailService();
    const mailResult = await Mail.sendProductDeletedEmail(ownerEmail, products.title, products.thumbnail); // Ajusta según tu lógica

    // Redirige a la página de productos después de la eliminación exitosa
    res.redirect('/products');
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    next(error); // Pasa el error al siguiente middleware de manejo de errores
  }
};
