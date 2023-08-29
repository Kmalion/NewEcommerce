import dotenv from "dotenv"
import express from "express"
import flash from "connect-flash"
import session from "express-session"
import passport from "passport"
import http from "http"
import Database from "./db.js"
import { fileURLToPath } from 'url'
import path from 'path';
import MongoStore from "connect-mongo"
import handlebars from "express-handlebars"
import { routerSession } from "./router/session.router.js"

const app = express();
const server = http.createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

//Middelware Sesiones
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: process.env.DB_CONNECTION_STRING, // Utilizamos la variable de entorno para la conexión a MongoDB
        }),
        secret: process.env.SESSION_SECRET, // Utilizamos la variable de entorno para la clave secreta de la sesión
        resave: true,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());
// Configurar connect-flash
app.use(flash());

//Variables globales
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.use(express.static(__dirname + '/public'));


// Configuracion de HandleBars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
path.join(__dirname, 'views')
//MiddleWares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use('/', routerHome);
//app.use('/chat', chatRouter);
//app.use('/products', productsRouter);
app.use('/', routerSession);
//app.use('/auth', routerSession)



server.listen(8080, () => {
    console.log('Servidor en el puerto 8080 !!');
    //Ejecuto la base de datos
    Database.connect();
}); 