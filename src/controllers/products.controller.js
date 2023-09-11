import  productsPaginateService  from '../services/products/products.paginator.service.js';
import ProductManagerService from '../services/products/products.manager.service.js';
import { validateUserRole } from '../services/policies/roleValidationService.js';

export const productsController = async (req, res, next) => {
  try {
    const Products = new ProductManagerService();
    const products = await Products.getProducts();
    const result = await productsPaginateService(req);
    const userProfile = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
    };
    res.render('home', {
      products: result.products,
      userProfile,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      nextPage: result.nextPage,
      prevPage: result.prevPage,
    });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    next(error); // Pasa el error al siguiente middleware de manejo de errores
  }
};

export const productsCreate = async (req, res, next) => {
  try {
    const Products = new ProductManagerService();
    const newProduct = {
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      thumbnail: req.body.thumbnail,
      code: req.body.code,
      status: req.body.status,
      stock: req.body.stock,
    };

    // Crea el nuevo producto en la base de datos
    await Products.addProduct(newProduct);

    // Redirige a la página de productos después de la creación exitosa
    res.redirect('/products');
  } catch (error) {
    console.error('Error al crear el producto:', error);
    next(error); // Pasa el error al siguiente middleware de manejo de errores
  }
}

export const productsCreateView = async (req, res, next) => {
  try {
    res.render('createProduct')

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
