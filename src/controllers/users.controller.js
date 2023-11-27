import multer from 'multer';
import path from 'path';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { UsersMongoDAO } from '../models/daos/mongo/users.mongo.dao.js';
import { setUserLoggedIn } from '../models/daos/mongo/auth.js';
import User from '../models/schema/users.schema.js';
import UserService from '../services/users/user.service.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Define la carpeta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

const usersDAO = new UsersMongoDAO();

export class UsersController {
    static generateToken(user, res) {
        const token = jwt.sign({ id: user.id }, config.jwt.SECRET, { expiresIn: '1h' });
        res.cookie(config.jwt.COOKIE, token, { maxAge: 3600000, httpOnly: true }); // Establece la cookie
        return token;
    }

    static async authenticateUser(req, res, next) {
        passport.authenticate('login', (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(401).json({ message: info.message });
            }

            req.logIn(user, (loginErr) => {
                if (loginErr) {
                    return next(loginErr);
                }
                setUserLoggedIn(user);
                const token = UsersController.generateToken(user, res);
                res.redirect('/view/profile');
            });
        })(req, res, next);
    }

    static async registerUser(req, res, next) {
        passport.authenticate('register', async (err, user, info) => {
            if (err) {
                return next(err);
            }
    
            if (!user) {
                req.flash('error', info.message); // Almacena el mensaje de error en flash
                return res.status(400).json({ message: info.message });
            }
    
            req.logIn(user, async (loginErr) => {
                if (loginErr) {
                    return next(loginErr);
                }
    
                const token = UsersController.generateToken(user, res);
                req.flash('success_msg', '¡Registro exitoso!'); // Almacena el mensaje de éxito en flash
                res.redirect('/');
            });
        })(req, res, next);
    }
    

    static async getCurrentUser(req, res, next) {
        res.send(req.user);
    }

    static async changeUserRole(req, res, next) {
        const userId = req.params.userId;
        console.log('ID Usuario a cambiar rol:', userId);

        try {
            // Verifica si el usuario actual es un administrador
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Acceso no autorizado' });
            }

            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            }

            // Guarda el rol actual del usuario antes de cambiarlo
            const oldRole = user.role;

            // Cambiar el rol del usuario
            const newRole = req.body.newRole;
            user.role = newRole || (user.role === 'user' ? 'premium' : 'user');
            await user.save();

            // Agrega un mensaje flash para informar al usuario sobre el cambio de rol
            req.flash('success_msg', `Rol de usuario actualizado exitosamente. Rol anterior: ${oldRole}, Nuevo rol: ${user.role}`);

            return res.status(200).json({
                success: true,
                message: 'Rol de usuario actualizado exitosamente',
                user,
            });
        } catch (error) {
            console.error('Error al actualizar el rol del usuario:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar el rol del usuario',
                error: error.message,
            });
        }
    }



    static async getUsersList(req, res, next) {
        try {
            // Verificar si el usuario está autenticado
            if (!req.isAuthenticated()) {
                req.flash('error', 'Debes iniciar sesión para acceder a esta página');
                return res.redirect('/'); // Ajusta la ruta según tu configuración
            }
            const userService = new UserService();
            const users = await userService.getAllUsers();

            const usersWithSelectedRole = users.map(user => {
                return {
                    ...user,
                    isAdminSelected: user.role === 'admin' ? 'selected' : '',
                    isUserSelected: user.role === 'user' ? 'selected' : '',
                    isPremiumSelected: user.role === 'premium' ? 'selected' : '',
                };
            });

            // Renderiza la vista de usuarios y pasa la lista de usuarios con roles seleccionados
            res.render('usersList', { users: usersWithSelectedRole });
        } catch (error) {
            console.error('Error al obtener la lista de usuarios:', error);
            next(error);
        }
    };


    static async uploadDocument(req, res, next) {
        try {
            const userId = req.params.userId;
            const { name } = req.body;

            // Verifica si el usuario existe
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Sube el archivo utilizando Multer
            upload.single('file')(req, res, async function (err) {
                if (err) {
                    return res
                        .status(500)
                        .json({ message: 'Error al subir el archivo', error: err.message });
                }

                // Agrega el documento al usuario
                const newDocument = {
                    name: name,
                    link: req.file.path, // Guarda la ruta del archivo subido
                };

                user.documents.push(newDocument);
                await user.save();

                res
                    .status(200)
                    .json({ message: 'Archivo subido exitosamente', document: newDocument });
            });
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .json({ message: 'Error al subir el archivo', error: error.message });
        }
    }
}
