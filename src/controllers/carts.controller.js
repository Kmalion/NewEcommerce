import CartsServiceManager from "../services/carts/carts.manager.service.js";
import CartSchema from "../models/schema/carts.schema.js";
import CartsMongoDAO from "../models/daos/mongo/carts.mongo.js"

const cartsDAO = new CartsMongoDAO()

export const cartsController = async (req, res) => {
    try {
        const Carts = new CartsServiceManager();
        const carts = await Carts.getCarts()

        res.render('carts', { carts });
    } catch (error) {
        console.error('Error al obtener los carritos:', error);
        res.status(500).json({ error: 'Error al obtener los carritos' });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const productId = req.params.productId;

        // Resto del código para agregar el producto al carrito
        console.log('Producto agregado:', productId); // Imprime el ID del producto agregado en la consola

        // Agregar producto a carrito con populate
        const cart1 = await CartSchema.findOne({ _id: '64b20b6f702122c5c747cd15' });
        cart1.products.push({ product: productId });
        await cart1.save();

        res.redirect('/api/carts'); // Redirige al usuario al carrito después de agregar el producto
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
}

export const createCart = async (req, res) => {
    try {
        const Carts = new CartsServiceManager();
        const carts = await Carts.createCart()
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
}
export const getProductsByCartId = async (req, res) => {
    try {
        
        const Carts = new CartsServiceManager(carts._id);
        const carts = await Carts.getProductsByCartId()
    } catch (error) {
        console.error('Error al obtener los productos por ID de carrito:', error);
            res.status(500).json({ error: 'Error al obtener los productos por ID de carrito' });
    }
}

export const deleteProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid; // Obtener el ID del carrito desde los parámetros de la URL
        const productId = req.params.pid; 
        const Carts = new CartsServiceManager();
        const carts = await Carts.deleteProductCart(cartId , productId)

    } catch (error) {
        console.error('Error al obtener los productos por ID de carrito:', error);
            res.status(500).json({ error: 'Error al obtener los productos por ID de carrito' });
    }
}
export const updateCart = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = req.body.quantity;
            const Carts = new CartsServiceManager();
            const carts = await Carts.updateCart(cartId , productId, quantity)
        } catch (error) {
            console.error('Error al obtener los productos por ID de carrito:', error);
                res.status(500).json({ error: 'Error al obtener los productos por ID de carrito' });
        }
}

