import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import ProductSchema from '../../models/schema/products.schema.js'; // Asegúrate de importar correctamente los modelos de productos

const Product = ProductSchema

const productsPaginateService = async (req, res) => {
  try {
    const category = req.query.category;
    const page = parseInt(req.query.page);
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const sort = req.query.sort;

    let options = {};

    if (category) {
      options.category = category;
    }

    if (sort) {
      options.sort = sort;
    }

    if (limit) {
      options.limit = limit;

      if (page) {
        options.page = page;
      }
    }

    const result = await Product.paginate({}, options); // Utiliza Product.paginate en lugar de Products.paginate

    if (result.docs.length > 0) {
      const products = result.docs.map((doc) => doc.toObject({ virtuals: true }));

      // Aquí pasas los datos del usuario en sesión a la vista (asegúrate de tener userLoggedIn definido)
      res.render('home', {
        products,
        userLoggedIn, // Pasamos el objeto con los datos del usuario en sesión a la vista
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        nextPage: result.nextPage,
        prevPage: result.prevPage,
      });
    } else {
      return res.status(204).send('No se encuentran productos');
    }
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

export default productsPaginateService;
