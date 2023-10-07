import { Router } from "express";
import { loginController } from "../../controllers/login.controller.js";
import { registerController } from "../../controllers/register.controller.js";
import { UsersController} from "../../controllers/users.controller.js";
import passport from "passport";

const router = Router()


router.get('/view/register', registerController);
router.get('/view/register', UsersController);
router.get('/', loginController);
router.get('/api/users/changeRole/:userId', UsersController.changeUserRole)

router.post('/auth/login-auth', UsersController.authenticateUser)
router.post('/auth/register-auth', UsersController.registerUser)
router.get('/current', passport.authenticate('current', {session:false}),
UsersController.getCurrentUser)

export default router
