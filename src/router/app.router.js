import { Router } from "express";
import usersRouter from './sessions/users.router.js'
import profileRouter from './profile/profile.router.js'
import productsRouter from './products/products.router.js'



const router = Router()

/// Sesiones ////
router.get('/view/register', usersRouter);
router.get('/', usersRouter);
router.post('/auth/login-auth', usersRouter)
router.post('/auth/register-auth', usersRouter)
router.get('/view/profile', profileRouter);

/// Productos ////

router.get('/products', productsRouter)

export default router
