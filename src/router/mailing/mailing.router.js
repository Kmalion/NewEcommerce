import { Router } from "express";
import { helloMailController, resetPasswordMailController, resetPasswordController } from '../../controllers/mail.controller.js'

const router = Router()

router.get('/mail', helloMailController)
router.get('/mailrecovery', resetPasswordMailController)
router.get('/reset-password', resetPasswordController)
router.post('/mailrecovery',resetPasswordMailController )

export default router