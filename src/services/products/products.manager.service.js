
import Product from "../../models/schema/products.schema.js"; // Importar el modelo de Product

class ProductManagerService {
    constructor() { }

    //////////////////////
    // Agregar productos//
    async addProduct(newProduct) {
        try {
            const { code } = newProduct;

            // Verificar si el código del producto ya existe
            const codeExists = await Product.exists({ code });
            if (codeExists) {
                console.log('Error al crear el producto: este código ya existe.');
                return;
            }

            const product = new Product(newProduct);
            await product.save();

            console.table(product);
            console.log('Creación de producto satisfactoria!');
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            throw error;
        }
    }

    ///////////////////////
    // Mostrar Productos//
    async getProducts(limit) {
        try {
            let query = Product.find().lean();
            if (limit) {
                query = query.limit(limit);
            }
            const products = await query.exec();
            return products;
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            throw error;
        }
    }

    /////////////////////////////
    //Mostrar Productos por ID//
    async getProductById(id) {
        try {
            const product = await Product.findById(id).exec();
            if (product) {
                console.log('Producto encontrado', product);
                return product;
            } else {
                const error = 'Producto no encontrado por ese ID';
                console.error(error);
                return error;
            }
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
            throw error;
        }
    }

    //////////////////////
    // Actualizar Datos //
    async updateProduct(id, newData) {
        try {
            const product = await Product.findByIdAndUpdate(id, newData, { new: true }).exec();
            if (product) {
                console.log('Producto actualizado correctamente...');
            } else {
                console.error('No se pudo actualizar el producto. ID no encontrado.');
            }
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            throw error;
        }
    }

    ///////////////////////
    // Eliminar Productos//
    async deleteProduct(id) {
        try {
            const product = await Product.findByIdAndDelete(id).exec();
            if (product) {
                console.table('Producto eliminado satisfactoriamente !!');
            } else {
                console.error('Producto no encontrado para eliminar');
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw error;
        }
    }
}

export default ProductManagerService