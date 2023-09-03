import passport from 'passport';
import { UsersMemoryDAO } from '../models/daos/memory/users.memory.dao.js'
import { UsersMongoDAO } from '../models/daos/mongo/users.mongo.dao.js';

//const usersDAO = new UsersMemoryDAO()
const usersDAO = new UsersMongoDAO()

export class UsersController {
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
                return res.status(400).json({ message: info.message });
            }

            req.logIn(user, async (loginErr) => {
                if (loginErr) {
                    return next(loginErr);
                }
                return res.status(201).json({ message: info.message, user: user }); // Cambia esto por la respuesta que necesites
            });
        })(req, res, next);
    }
}



