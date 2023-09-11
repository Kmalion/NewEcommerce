import { Router } from "express";
import { purchaseController } from "../../controllers/purchase.controller.js";

const router = Router()

router.get('/api/:cid/purchase', purchaseController);

export default router