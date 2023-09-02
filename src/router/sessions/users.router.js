import { Router } from "express";
import { loginController } from "../../controllers/login.controller.js";
import { registerController } from "../../controllers/register.controller.js";
import { UsersController } from "../../controllers/users.controller.js";

const router = Router()


router.get('/view/register', registerController);
router.get('/view/register', UsersController);
//router.get('/', UsersController);
router.get('/', loginController);

router.post('/auth/login-auth', UsersController.authenticateUser)
router.post('/auth/register-auth', UsersController.registerUser)

export default router
