//Administrador de carrito ---- Crsitian Camilo Florez Prieto --- Practica inmtegradora M<ongo DB--- Backend
import mongoose from 'mongoose'
import CartSchema from '../../models/schema/carts.schema.js' 
import ProductSchema from '../../models/schema/products.schema.js';// Importar el modelo de Cart


class CartsServiceManager {
    constructor(path) {
        this.path = path;
    }
    ///////CREA CARRITO/////////////
    async addCart(newCart, products, userId) {
    try {
        const currentDate = new Date().toISOString();

        newCart.date = currentDate;
        newCart.products = products;
        newCart.userId = userId; // Asocia el carrito con el ID del usuario

        const cart = new CartSchema(newCart);
        await cart.save();


        console.log('Carrito agregado exitosamente!');
    } catch (error) {
        console.error('Error al agregar el carrito:', error);
        throw error;
    }
}

async getCarts(userId) {
    try {
        const carts = await CartSchema.find({ userId }).populate('products.product').lean();
        
        // Filtra los carritos que tengan al menos un producto
        const nonEmptyCarts = carts.filter(cart => cart.products.length > 0);
        
        return nonEmptyCarts;
    } catch (error) {
        console.error('Error al mostrar el carrito:', error);
        throw error;
    }
}


    /// Obtener Carrito por ID //////////
    async getCartById(cartId) {
        try {
            const cart = await CartSchema.findOne({ cid: cartId });

            if (cart) {
                return cart;
            } else {
                return null; // Si no se encuentra el carrito, se devuelve null
            }
        } catch (error) {
            console.error('Error al obtener el carrito por ID:', error);
            throw error; // Se lanza el error para manejarlo en el controlador de la ruta
        }
    }

// Mostrar producto por ID de carrito
async getProductsByCartId(cartId) {
    try {
        // Obtener el carrito por ID
        const cart = await CartSchema.findById(cartId).populate('products.product');

        if (!cart) {
            console.log("No se encuentra el carrito");
            return null;
        }

        // Obtener los productos del carrito
        const products = cart.products;
        return products;
    } catch (error) {
        console.error('Error al obtener los productos por ID de carrito:', error);
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

    async addProductToCart(cartId, productId, userId) {
        try {
            // Busca un carrito existente para el usuario actual con el mismo cartId
            let cart = await CartSchema.findOne({ cid: cartId, userId }).exec();
    
            if (!cart) {
                // Si el carrito no existe para el usuario actual con el mismo cartId, crea uno nuevo
                cart = new CartSchema({
                    cid: cartId,
                    userId: userId,
                    products: [],
                    date: new Date().toISOString(),
                });
            }
    
            const now = new Date();
            const formattedDate = now.toLocaleDateString();
    
            const product = {
                product: productId,
                quantity: 1,
                date: formattedDate,
            };
    
            cart.products.push(product);
    
            await cart.save();
            return { status: 200, message: 'Producto Agregado al Carrito' };
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            throw error;
        }
    }
    
    
    
    async deleteProductCart(cartId, productId) {
        try {
            // Buscar el carrito por su ID
            const cart = await CartSchema.findById(cartId);
    
    
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
    
            // Filtrar los productos del carrito, excluyendo el producto que se desea eliminar
            cart.products = cart.products.filter(item => item.product.toString() !== productId);
    
            // Eliminar el producto del carrito
            await cart.updateOne({ $pull: { products: { product: productId } } });

            return { message: 'Producto eliminado del carrito exitosamente' };
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            throw error;
        }
    }
    
    async  updateCart(cartId, productId, quantity) {
        try {
            // Buscar el carrito por su ID
            const cart = await CartSchema.findById(cartId).populate('products.product');

            if (!cart) {
                return { status: 404, message: 'Carrito no encontrado' };
            }
    
            // Buscar el producto en el carrito por su ID
            const product = cart.products.find(item => item.product.equals(productId));
    
            console.log('Producto encontrado:', product);
    
            if (!product) {
                return { status: 404, message: 'Producto no encontrado en el carrito' };
            }
    
            // Validar que la cantidad sea un número válido mayor a cero
            if (isNaN(quantity) || parseInt(quantity) <= 0) {
                return { status: 400, message: 'La cantidad debe ser un número válido mayor a cero' };
            }
    
            // Actualizar la cantidad del producto
            product.quantity = parseInt(quantity);
    
            // Guardar los cambios en el carrito
            await cart.save();
    
            console.log('Cantidad del producto actualizada:', product.quantity);
    
            return { status: 200, message: 'Cantidad del producto actualizada exitosamente' };
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito:', error);
            return { status: 500, message: 'Error al actualizar la cantidad del producto en el carrito' };
        }
    }
    

    async createCart(userId) {
        try {
            const currentDate = new Date();
            const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}`;
    
            const newCart = new Cart({
                cid: Math.random().toString(30).substring(2),
                date: formattedDate,
                userId, // Asocia el carrito con el ID del usuario
            });
    
            const products = { ...req.body };
            newCart.products.push(products);
            await newCart.save();
    
            res.send({
                statusCode: 200,
                payload: newCart
            });
    
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            res.status(500).json({ error: 'Error al crear el carrito' });
        }
    }
    async deleteCart(userId) {
        try {

            const result = await CartSchema.deleteMany({ userId: userId });
    
            if (!result.deletedCount) {
                return { status: 404, message: 'Carritos no encontrados para el usuario' };
            }
    
            return { status: 200, message: 'Carritos eliminados exitosamente' };
        } catch (error) {
            console.error('Error al eliminar los carritos:', error);
            return { status: 500, message: 'Error al eliminar los carritos' };
        }
    }
    

}

export default CartsServiceManager;