import express from "express";
import productRouter from './src/router/product.test.router.js'
import handlebars from "express-handlebars"
import { fileURLToPath } from 'url'
import path from 'path';
import errorMiddleware from "./middleware/indexControlError.js"

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/', productRouter)
app.use(errorMiddleware)



// Configuracion de HandleBars
app.engine('handlebars', handlebars.engine({
    extname: 'handlebars',
    defaultLayout: 'main',
    helpers: {
    }}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
path.join(__dirname, 'views')

app.listen(8080, ()=>{
    console.log("Server Testing UP")
})

