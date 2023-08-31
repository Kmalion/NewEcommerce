import passport from 'passport';
import { UsersMemoryDAO } from '../models/daos/memory/users.memory.dao.js'
import { UsersMongoDAO } from '../models/daos/mongo/users.mongo.dao.js';

//const usersDAO = new UsersMemoryDAO()
const usersDAO = new UsersMongoDAO()

export class UsersController {
    static async authenticateUser(req, res, next) {
        // passport.authenticate('login', {
        //     successRedirect: '/view/profile', // Redirige al perfil del usuario después del inicio de sesión exitoso
        //     failureRedirect: '/view/login', // Redirige a la página de inicio de sesión en caso de fallo de autenticación
        //     failureFlash: true, // Habilita mensajes flash para el fallo
        //     successFlash: 'Inicio de sesión exitoso.', // Mensaje flash para el éxito
        // })
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
                return res.json(user); // Cambia esto por la respuesta que necesites
            });
        })(req, res, next);
    }
}



