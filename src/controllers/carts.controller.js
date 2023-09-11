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



export const addProductToCartController = async (req, res) => {
    try {
        const cartId = req.params.cid; // Obtener el ID del carrito desde los parámetros de la URL
        const productId = req.params.pid; 
        console.log('ID producto',productId)
        const Carts = new CartsServiceManager();
        const carts = await Carts.addProductToCart(cartId, productId)
        res.redirect('/api/carts')

    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        throw error;
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

export const deleteProductCartController = async (req, res) => {
    try {
        const cartId = req.params.cid; // Obtener el ID del carrito desde los parámetros de la URL
        const productId = req.params.pid; 
        console.log('Id del carrito desde el controller ', cartId)
        const Carts = new CartsServiceManager();
        const carts = await Carts.deleteProductCart(cartId , productId)
        res.redirect('/api/carts')

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
            res.redirect('/api/carts')
        } catch (error) {
            console.error('Error al obtener los productos por ID de carrito:', error);
                res.status(500).json({ error: 'Error al obtener los productos por ID de carrito' });
        }
}

