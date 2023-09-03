import productsPaginateService from '../services/products/products.paginator.service.js'
import ProductManagerService from '../services/products/products.manager.service.js'


export const productsController = async (req, res) => { 
    try { 
        const Products = new ProductManagerService();
        const products = await Products.getProducts();
        res.render('home', {products})
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
    try {
        const result = await productsPaginateService(req, res); // Llamada al servicio con req y res como argumentos
        // Resto del código
      } catch (error) {
        console.error('Error en la llamada al servicio:', error);
        // Manejo de errores
      }

}


