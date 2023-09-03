import { Router } from "express";
import { profileController } from "../../controllers/profile.controller.js";

const router = Router()

router.get('/view/profile', profileController);

export default router