import { Router } from "express";
import { profileController } from "../../controllers/profile.controller.js";
import { profileSummaryController } from "../../controllers/profile.controller.js"

const router = Router()

router.get('/view/profile', profileController);
router.get('/products', profileSummaryController );

export default router