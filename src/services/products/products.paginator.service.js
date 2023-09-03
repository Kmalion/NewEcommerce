import ProductSchema from '../../models/schema/products.schema.js';
import mongoosePaginate from 'mongoose-paginate-v2';

const Product = ProductSchema;

const productsPaginateService = async (req) => {
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

    const result = await Product.paginate({}, options);

    if (result.docs.length > 0) {
      const products = result.docs.map((doc) => doc.toObject({ virtuals: true }));
      return {
        products,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        nextPage: result.nextPage,
        prevPage: result.prevPage,
      };
    } else {
      // En caso de que no haya productos, puedes devolver un objeto con los datos vacíos
      return {
        products: [],
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null,
      };
    }
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    // Puedes lanzar el error para que sea manejado por el controlador
    throw error;
  }
};


export default productsPaginateService