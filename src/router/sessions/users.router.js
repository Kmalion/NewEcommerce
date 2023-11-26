import { Router } from "express";
import { loginController } from "../../controllers/login.controller.js";
import { registerController } from "../../controllers/register.controller.js";
import { UsersController} from "../../controllers/users.controller.js";
import passport from "passport";

const router = Router();

router.get('/view/register', registerController);
router.get('/', loginController);

// Rutas relacionadas con usuarios
router.post('/api/users/changeRole/:userId', UsersController.changeUserRole);
router.post('/api/users/:userId/upload', UsersController.uploadDocument); // Nueva ruta para subir documentos

// Rutas de autenticación con GitHub
router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/products');
    }
);
router.get('/api/users/list', UsersController.getUsersList)
router.post('/auth/login-auth', UsersController.authenticateUser);
router.post('/auth/register-auth', UsersController.registerUser);
router.get('/current', passport.authenticate('current', {session:false}),UsersController.getCurrentUser);

export default router;
