//Administrador de carrito ---- Crsitian Camilo Florez Prieto --- Practica inmtegradora M<ongo DB--- Backend
import mongoose from 'mongoose'
import CartSchema from '../../models/schema/carts.schema.js' // Importar el modelo de Cart


class CartsServiceManager {
    constructor(path) {
        this.path = path;
    }
    ///////CREA CARRITO/////////////
    async addCart(newCart, products) {
        try {
            const currentDate = new Date().toISOString();

            newCart.date = currentDate;
            newCart.products = products;

            const cart = new CartSchema(newCart);
            await cart.save();

            console.table(cart);
            console.log('Carrito agregado exitosamente!');
        } catch (error) {
            console.error('Error al agregar el carrito:', error);
            throw error;
        }
    }

    async getCarts() {
        try {
            const carts = await CartSchema.find().populate('products.product').lean();
            return carts;
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

    //////////////////////////////////////
    //Mostrar producto por ID de carrito//
    async getProductsByCartId(cartId) {
        try {
            // Obtener el carrito por ID
            const cart = await CartSchema.findById(cartId).populate('products.product');
            if (!cart) {
                
            }
            // Obtener los productos del carrito
            const products = cart.products;
            res.json(products);
        } catch (error) {
            console.error('Error al obtener los productos por ID de carrito:', error);
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            let cart = await CartSchema.findOne({ cid: cartId }).exec();
            if (!cart) {
                cart = new CartSchema({ cid: cartId, products: [], date: new Date().toISOString() });
            }
            
            const now = new Date();
            const formattedDate = now.toLocaleDateString(); // Formatea la fecha según tu preferencia
    
            const product = {
                product: productId,
                quantity: 1,
            };
    
            // Agrega el producto al arreglo "products" del carrito
            cart.products.push({ ...product, date: formattedDate }); // Agrega la fecha al producto
    
            await cart.save();
    
            console.log('Producto agregado al carrito');
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            throw error;
        }
    }
    
    async deleteProductCart(cartId, productId) {
        try {
            // Buscar el carrito por su ID
            const cart = await CartSchema.findById(cartId);
    
            console.log('Carrito encontrado:', cart);
    
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
    
            console.log('Carrito encontrado:', cart);
    
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
    

    async createCart() {
        try {
            const currentDate = new Date();
            const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}`;

            const newCart = new Cart({
                cid: Math.random().toString(30).substring(2),
                date: formattedDate, // Utiliza la fecha formateada
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


}

export default CartsServiceManager;