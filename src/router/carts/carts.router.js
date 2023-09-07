import { Router } from "express";
import { cartsController, addProductToCart, createCart, getProductsByCartId, deleteProductCart, updateCart } from "../../controllers/carts.controller.js";


const router = Router()


router.get('/api/carts', cartsController)
router.get('/cart/add/:productId', addProductToCart)
router.post('/api/carts', createCart)
router.get('/api/carts/:id', getProductsByCartId)
router.delete('/api/carts/:cid/products/:pid', deleteProductCart)
router.put('/api/carts/:cid/products/:pid', updateCart)

export default router