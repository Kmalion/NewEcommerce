import MailService from '../services/mailing/mailing.service.js';
import User from '../models/schema/users.schema.js'
import bcrypt from 'bcrypt';

const mailController = new MailService();

export const helloMailController = async (req, res) => {
    try {
        let result = await mailController.sendHelloMail();
        res.send(result);
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
};

export const resetPasswordMailController = async (req, res) => {
    try {
        const { email } = req.body; 
         // Este es el console.log para validar el email
        if (!email) {
            return res.status(400).send({ status: 'error', error: 'Correo electrónico no proporcionado' });
        }

        const resetToken = mailController.generateResetToken();
        console.log(resetToken)
        let result = await mailController.sendResetPasswordMail(email, resetToken);
        res.send(result);
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
};

export const resetPasswordController = (req, res) => {
    res.render('reset', {
        ErrorMessages: req.flash('error'),
        successMessages: req.flash('success')
    });
};

export const newPasswordController = (req, res) => {
    const resetToken = req.params.resetToken; // Capturar resetToken de la URL
    const user =  User.findOne({ resetToken });
    if (!user) {
        return res.status(404).json({ status: 'error', error: 'Token inválido o expirado' });
    }
    if (user.resetTokenExpires && Date.now() > user.resetTokenExpires) {
        return res.status(400).json({ status: 'error', error: 'El token ha expirado' });
    }
    res.render('new', {
        resetToken, // Pasar resetToken a la plantilla
        ErrorMessages: req.flash('error'),
        successMessages: req.flash('success')
    });
};

export const createNewPasswordController = async (req, res) =>{
    const { newPassword, confirmPassword } = req.body;
    const resetToken = req.params.resetToken;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
        // Verificar si la nueva contraseña y la confirmación coinciden
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ status: 'error', error: 'Las contraseñas no coinciden' });
        }
        let result = await mailController.updatePassword(hashedPassword, resetToken);

        return res.status(200).json({ status: 'success', message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
}
