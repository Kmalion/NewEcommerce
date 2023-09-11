import { Router } from "express";
import { deleteProductController, productsController, productsCreate, productsCreateView } from "../../controllers/products.controller.js";

const router = Router()

router.get('/products', productsController)
router.get('/products/create', productsCreateView)
router.post('/products/create', productsCreate)
router.get('/product/delete/:pid', deleteProductController)

export default router