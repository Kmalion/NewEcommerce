import { generateProducts } from "../utils/mock.utils.js";
import  { Router } from "express";
import customError from "../../customError.js";
import EError from "../../enum.js";
import {createProductError} from "../../info.js"

const router = Router ();

router.get("/mockingproducts", (req, res)=>{
    const total =+ req.query.total || 100;
    const products = Array.from({length:total}, generateProducts)
    res.render('home', {
        products: products
    });
})
const products = [] 
router.get('/products/create', (req,res)=>{
    res.render('create', {
    });
})
router.post('/products/create', (req,res)=>{
    console.log(req.body)
    const { title, category, description, price, thumbnail, code, status, stock } = req.body;
    if (!title || !category || !description || !price || !thumbnail || !code || !status || !stock){
        customError.createError({
            name: "Error al crear el producto",
            cause: createProductError({title}),
            message: "Error al intentar crear el producto",
            code: EError.INVALID_TYPES_ERROR
        })
    }
    const product={
        title ,
        category,
        description,
        price,
        thumbnail,
        code,
        status,
        stock
    }
    products.push(product)
    res.send({status:"success", payload: products})

})

export default router

