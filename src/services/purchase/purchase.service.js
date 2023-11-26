
import PurchaseSchema from "../../models/schema/purchase.schema.js"
import ProductSchema from "../../models/schema/products.schema.js";
import Cart from "../../models/schema/carts.schema.js";


class PurchaseManagerService {
    constructor() { }
    
    async purchaseProducts(products, userEmail) {
        try {
            let totalAmount = 0;

            for (const product of products) {
                const productId = product.productId;
                const quantity = product.quantity;
                const stock = await this.getStockForProduct(productId);

                if (quantity <= stock) {
                    await this.updateStock(productId, quantity);

                    const productInfo = await ProductSchema.findById(productId);
                    totalAmount += productInfo.price * quantity;
                } else {
                    console.log("No hay stock del producto", productId);
                }
            }

            if (totalAmount === 0) {
                throw new Error("El total de la compra es cero. No se puede proceder con la compra.");
            }

            const code = Math.random().toString(36).substring(2, 8);
            const purchase_datetime = new Date().toISOString();

            // Crear un objeto que represente el ticket
            const ticket = {
                status: 'Compra exitosa',
                purchaser: userEmail,
                purchase_datetime: purchase_datetime,
                code: code,
                amount: totalAmount
            };

            // Agregar la compra a la base de datos
            const purchase = await PurchaseSchema.create({
                products: products,
                purchaser: userEmail,
                purchase_datetime: purchase_datetime,
                code: code,
                amount: totalAmount
            });

            return [ticket]; // Devuelve un arreglo con el ticket
        } catch (error) {
            console.error('Error al realizar la compra de productos:', error);
            throw error;
        }
    }
    
    async getStockForProduct(productId) {
        try {
            // Suponiendo que tienes un modelo de productos llamado ProductSchema
            const product = await ProductSchema.findById(productId);

            if (product) {
                return product.stock; // Devuelve la cantidad de stock del producto
            } else {
                return null; // Si el producto no se encuentra, puedes devolver null o un valor indicativo
            }
        } catch (error) {
            console.error('Error al obtener el stock del producto:', error);
            throw error;
        }
    }

    async updateStock(productId, purchasedQuantity) {
        try {
            // Suponiendo que tienes un modelo de productos llamado ProductSchema
            const product = await ProductSchema.findById(productId);

            if (product) {
                // Actualiza el stock después de la compra
                product.stock -= purchasedQuantity;
                await product.save();
            } else {
                console.error('Producto no encontrado:', productId);
            }
        } catch (error) {
            console.error('Error al actualizar el stock del producto:', error);
            throw error;
        }
    }

}

export default PurchaseManagerService;
