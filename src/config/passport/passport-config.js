import passport from 'passport';
import GitHubStrategy from 'passport-github';
import { Strategy as LocalStrategy } from 'passport-local';
import { UsersMongoDAO } from '../../models/daos/mongo/users.mongo.dao.js';
import bcrypt from 'bcryptjs';
import jwt, { ExtractJwt } from 'passport-jwt';
import config from '../config.js';

const usersDAO = new UsersMongoDAO(); // O UsersMemoryDAO si prefieres
const JwtStrategy = jwt.Strategy;

passport.use('login', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email',
    passwordField: 'password',
}, async (req, email, password, done) => {
    try {
        const user = await usersDAO.findOne({ email });

        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return done(null, false, { message: 'Contraseña incorrecta. Por favor, verifique sus datos.' });
        }

        // Incluye documentos en la sesión si es relevante
        req.session.first_name = user.first_name;
        req.session.last_name = user.last_name;
        req.session.email = user.email;
        req.session.age = user.age;
        req.session.role = user.role;
        req.session.documents = user.documents;

        done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, email, password, done) => {
        try {
            const existingUser = await usersDAO.findOne({ email });

            if (existingUser) {
                return done(null, false, { message: 'Este email ya fue registrado. Intente de nuevo.' });
            }

            const { first_name, last_name, age, role } = req.body;

            const newUser = await usersDAO.create({
                email,
                password: await bcrypt.hash(password, 10),
                first_name,
                last_name,
                age,
                role,
            });

            req.session.first_name = newUser.first_name;
            req.session.last_name = newUser.last_name;
            req.session.email = newUser.email;
            req.session.age = newUser.age;
            req.session.role = newUser.role;
            req.session.documents = newUser.documents;

            return done(null, newUser, { message: 'Registro exitoso. Ahora puedes iniciar sesión.' });
        } catch (error) {
            return done(error);
        }
    }
));

passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
}, async (req,  accessToken, refreshToken, profile, done) => {
    const user = await usersDAO.findOne({ githubId: profile.id });

    if (user) {
        return done(null, user);
    } else {
        // Crea un nuevo usuario con la información de GitHub
        const newUser = await usersDAO.create({
            githubId: profile.id,
            email: profile.role || '',
            documents: [], // Incluye cualquier información adicional necesaria aquí
        });

        // Incluye documentos en la sesión si es relevante
        req.session.first_name = newUser.first_name;
        req.session.last_name = newUser.last_name;
        req.session.email = newUser.email;
        req.session.age = newUser.age;
        req.session.role = newUser.role;
        req.session.documents = newUser.documents;

        return done(null, newUser);
    }
}));

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies[config.jwt.COOKIE];
    }
    return token;
};

passport.use('current', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: config.jwt.SECRET,
}, async (jwt_payload, done) => {
    try {
        return done(null, jwt_payload);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    // Serialize the user's ID
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await usersDAO.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;
