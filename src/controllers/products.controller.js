import  productsPaginateService  from '../services/products/products.paginator.service.js';
import ProductManagerService from '../services/products/products.manager.service.js';
import UserValidator from '../services/policies/roleValidationService.js'

export const productsController = async (req, res, next) => {
  try {
    const Products = new ProductManagerService();
    const products = await Products.getProducts();
    const result = await productsPaginateService(req);
    const productIds = products.map(product => product._id);
    const owner = await products.map(product => product.owner);
    const userProfile = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
    };
    const Validator = new UserValidator();
    const isPremium = await Validator.validateUserRole(userProfile,"premium")
    const isAdmin = await Validator.validateUserRole(userProfile, "admin");
    const isAdminOrOwner = await Validator.isUserAdminOrOwner(userProfile, owner);
    const isOwner = await Validator.isOwner(userProfile, products);
    const isOwnerResults = await Validator.isOwner(userProfile, products);
    const productsWithOwnership = products.map((product, index) => ({
      ...product,
      isOwner: isOwnerResults[index]
    }));
    res.render('home', {
      products: result.products,
      userProfile, productsWithOwnership,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      nextPage: result.nextPage,
      prevPage: result.prevPage,
      isAdmin, isAdminOrOwner,isPremium,isOwner
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
}

export const deleteProductController = async (req, res, next) => {
  try {
    const productId = req.params.pid;
    const Products = new ProductManagerService();
    const products = await Products.deleteProduct(productId);
    res.redirect('/products')

  } catch (error) {
    console.error('Error al eliminar producto:', error);
    next(error); // Pasa el error al siguiente middleware de manejo de errores
  }
}
