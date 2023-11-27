
import Product from "../../models/schema/products.schema.js"; // Importar el modelo de Product

class ProductManagerService {
    constructor() {
        this.saveBehavior = null;
        this.findBehavior = null;
    }

    setSaveBehavior(callback) {
        this.saveBehavior = callback;
    }

    setFindBehavior(callback) {
        this.findBehavior = callback;
    }

    //////////////////////
    // Agregar productos//
    async addProduct(newProduct) {
        try {
            const { code } = newProduct;

            // Verificar si el código del producto ya existe
            const codeExists = await Product.exists({ code });
            if (codeExists) {
                console.log('Error al crear el producto: este código ya existe.');
                return { status: 400, message: 'El código ya existe' };
            }

            const product = new Product(newProduct);
            await product.save();
            return { status: 200, message: 'Producto creado exitosamente' };
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
    async deleteProduct(productId) {
        try {
            // Encuentra el producto por ID antes de eliminarlo
            const deletedProduct = await Product.findById(productId);

            if (!deletedProduct) {
                throw new Error('El producto no fue encontrado.');
            }

            // Elimina el producto después de obtener su información
            await Product.findByIdAndDelete(productId);

            return deletedProduct;
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }

    async getProductOwner(productId) {
        console.log('Prodcuto ID en el servicio', productId)
        try {
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            const owner = product.owner; // Aquí asumo que la propiedad "owner" está almacenada en el modelo de producto

            return owner;
        } catch (error) {
            throw error;
        }
    }
}

export default ProductManagerService