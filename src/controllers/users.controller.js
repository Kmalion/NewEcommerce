import passport from 'passport';
import jwt from 'jsonwebtoken';
import { UsersMemoryDAO } from '../models/daos/memory/users.memory.dao.js'
import { UsersMongoDAO } from '../models/daos/mongo/users.mongo.dao.js';
import { setUserLoggedIn } from '../models/daos/mongo/auth.js';
import config from '../config/config.js';


const usersDAO = new UsersMongoDAO()

export class UsersController {
    static  generateToken(user , res) {
        const token = jwt.sign({ id: user.id }, config.jwt.SECRET, { expiresIn: '1h' });
        res.cookie(config.jwt.COOKIE, token, { maxAge: 3600000, httpOnly: true }); // Establece la cookie
        return token;
    }

    static async authenticateUser( req, res, next) {
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
                return res.status(400).json({ message: info.message });
            }
    
            req.logIn(user, async (loginErr) => {
                if (loginErr) {
                    return next(loginErr);
                }
                const token = UsersController.generateToken(user, res); // Pasa `res` aquí
                res.redirect('/')
            });
        })(req, res, next);
    }
    static async getCurrentUser(req,res,next){
        res.send(req.user)
    }
}
