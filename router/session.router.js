import express from "express";
import { registerController } from "../controllers/session.controller.js";

const routerSession = express.Router(); // Crea una instancia del enrutador

routerSession.get('/view/register', registerController);

routerSession.get('/', (req, res) => {
    res.render('login');
});

export { routerSession };
