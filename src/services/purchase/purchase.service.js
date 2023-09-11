
import Purchase from "../../models/schema/purchase.schema.js"; 
import Product from "../../models/schema/products.schema.js";
import Cart from "../../models/schema/carts.schema.js";


class PurchaseManagerService {
    constructor() { }
    async purchaseProducts(productId, quantity) {
        try {
            const purchase_datetime = new Date().toISOString();
            const product = await Product.findById(productId);
            const cart = await Cart.findOne({ products: { $elemMatch: { product: productId } } });
            const productInCart = cart.products.find(item => item.product.equals(productId));

            if (!product || !cart || !productInCart) {
                throw new Error(`Producto o carrito no encontrado`);
            }

            if (product.stock >= quantity && productInCart.quantity >= quantity) {
                product.stock -= quantity;
                productInCart.quantity -= quantity;

                await product.save();
                await cart.save();

                return `Compra exitosa: ${quantity} ${product.name} comprados`;
            } else {
                throw new Error(`No hay suficiente stock de ${product.name}`);
            }

        } catch (error) {
            console.error('Error al realizar la compra:', error);
            throw error;
        }
    }
}

export default PurchaseManagerService;
