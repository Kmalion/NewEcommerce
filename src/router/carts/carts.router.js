import { Router } from "express";
import { cartsController, addProductToCartController, createCart, getProductsByCartId, deleteProductCartController, updateCart } from "../../controllers/carts.controller.js";


const router = Router()


router.get('/api/carts', cartsController)
router.get('/cart/add/:pid', addProductToCartController)
router.post('/api/carts', createCart)
router.get('/api/carts/:id', getProductsByCartId)
router.get('/api/carts/:cid/products/:pid', deleteProductCartController)
router.put('/api/carts/:cid/products/:pid', updateCart)

export default router