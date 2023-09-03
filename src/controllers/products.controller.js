import  productsPaginateService  from '../services/products/products.paginator.service.js';
import ProductManagerService from '../services/products/products.manager.service.js';

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
