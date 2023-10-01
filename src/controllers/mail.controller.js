import MailService from '../services/mailing/mailing.service.js';

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