import express from 'express';
import flash from 'connect-flash';
import session from 'express-session';
import passport from './src/config/passport/passport-config.js';
import { fileURLToPath } from 'url';
import path from 'path';
import MongoStore from 'connect-mongo';
import handlebars from 'express-handlebars';
import CONFIG from './src/config/config.js';
import appRouter from './src/router/app.router.js';
import { Strategy as LocalStrategy } from 'passport-local';
import { addLogger } from './src/utils/logger.js';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express';

const PORT = CONFIG.mongo.PORT;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion Ecommerce Dementho',
            description: 'API del Ecommerce',
            contact: {
                name: 'Soporte de la API',
                url: 'wwww.dementho.com',
                email: 'dementhodesarrollo@gmail.com',
            },
        },
    },
    apis: [`${process.cwd()}/src/docs/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);

// Middleware Sesiones
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: process.env.DB_CONNECTION_STRING,
        }),
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    })
);

app.use('/uploads', express.static('uploads'));
app.use(passport.initialize());
app.use(passport.session());

// Configurar connect-flash
app.use(flash());
app.use(cookieParser());

// Variables globales
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.use(express.static(__dirname + '/public'));

// Configuracion de HandleBars
app.engine(
    'handlebars',
    handlebars.engine({
        extname: 'handlebars',
        defaultLayout: 'main',
        helpers: {},
    })
);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use(addLogger);

app.get('/loggerTest', (req, res) => {
    req.logger.info('Esto es un mensaje INFO');
    res.send('Pruebas de logger en PRODUCCION');
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', appRouter);
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs));

app.listen(PORT, () => {
    console.log('Server UP');
});
