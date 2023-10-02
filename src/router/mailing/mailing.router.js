import { Router } from "express";
import { helloMailController, resetPasswordMailController, resetPasswordController, newPasswordController, createNewPasswordController } from '../../controllers/mail.controller.js'

const router = Router()

router.get('/mail', helloMailController)
router.get('/mailrecovery', resetPasswordMailController)
router.get('/reset-password', resetPasswordController)
router.post('/reset-password', createNewPasswordController)
router.post('/mailrecovery',resetPasswordMailController )
router.get('/reset-password/:resetToken', newPasswordController)
router.post('/reset-password/:resetToken', createNewPasswordController)
export default router