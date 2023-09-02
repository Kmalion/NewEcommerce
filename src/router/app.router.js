import { Router } from "express";
import usersRouter from './sessions/users.router.js'


const router = Router()


router.get('/view/register', usersRouter);
router.get('/', usersRouter);
router.post('/auth/login-auth', usersRouter)
router.post('/auth/register-auth', usersRouter)

export default router
