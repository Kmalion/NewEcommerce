import { Router } from "express";
import { profileController, showUploadForm, saveImageLinkToUserProfile, handleImageUpload } from "../../controllers/profile.controller.js";
import { profileSummaryController } from "../../controllers/profile.controller.js"

const router = Router()

router.get('/view/profile', profileController);
router.get('/products', profileSummaryController );
router.get('/uploadForm', showUploadForm );
router.post('/upload', handleImageUpload, saveImageLinkToUserProfile);

export default router