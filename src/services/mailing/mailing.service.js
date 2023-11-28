import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../../models/schema/users.schema.js'
import bcrypt from 'bcryptjs'

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: process.env.MAILING_SERVICE,
            port: process.env.MAILING_PORT,
            auth: {
                user: process.env.MAILING_USER,
                pass: process.env.MAILING_PASSWORD
            }
        });
    }

    async sendHelloMail() {
        try {
            let result = await this.transporter.sendMail({
                from: process.env.MAILING_USER,
                to: 'kmalion57@gmail.com',
                subject: 'Test desde Ecommerce',
                html: `<!DOCTYPE html>
                    <html lang="es">
                    
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                        <title>Prueba de Envío de Correo para Ecommerce</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-MFjF0csQgzIUhUVs6FfFYT6Oh3U3ErV73YEGFmILsU3BpkCUln1f5BcDY7HpM7IgH" crossorigin="anonymous">
                    </head>
                    
                    <body>
                        <div class="container">
                            <div class="row">
                                <div class="col-md-12">
                                    <h1>Hola, ¡esto es una prueba de envío de correo para el ecommerce!</h1>
                                    <p>¡Descubre las mejores ofertas en nuestra tienda en línea!</p>
                                    <p><a href="https://locallhost:8080" class="btn btn-primary">Ir a la Tienda</a></p>
                                    <img src="cid:pruebaDementho" alt="Dementho Logo">
                                </div>
                            </div>
                        </div>
                    
                        <!-- Scripts de Bootstrap y otros -->
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-qGiFz7uhkE5wE9IiSzPmLvCJQG0pBhOu4M2sZS+nc2IitGjvh5ZfRG5zNtBYYKoKS" crossorigin="anonymous"></script>
                    </body>
                    
                    </html>`,
                attachments: [{
                    filename: 'dementho_logo.jpg',
                    path: 'public/img/dementho_logo.jpg',
                    cid: 'pruebaDementho'
                }]
            });
            return { status: 'success', result: 'Email enviado' };
        } catch (error) {
            return { status: 'error', error: error.message };
        }
    }
    generateResetToken() {
        return crypto.randomBytes(20).toString('hex');
    }

    async sendResetPasswordMail(email, resetToken) {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return { status: 'error', error: 'El correo electrónico no está registrado. Por favor, regístrese.' };
            }

            const resetTokenExpires = Date.now() + 3600000
            user.resetTokenExpires = resetTokenExpires;
            user.resetToken = resetToken;
            await user.save();
            let result = await this.transporter.sendMail({
                from: process.env.MAILING_USER,
                to: email,
                subject: 'Restablecimiento de Contraseña',
                html: `<!DOCTYPE html>
                        <html lang="es">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                                <title>Restablecimiento de Contraseña</title>
                                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-MFjF0csQgzIUhUVs6FfFYT6Oh3U3ErV73YEGFmILsU3BpkCUln1f5BcDY7HpM7IgH" crossorigin="anonymous">
                            </head>
                            <body>
                                <div class="container">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <h1>Restablecimiento de Contraseña</h1>
                                            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el siguiente enlace para continuar:</p>
                                            <a href="http://localhost:8080/reset-password/${resetToken}" class="btn btn-primary">Restablecer Contraseña</a>
                                        </div>
                                    </div>
                                </div>
                                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-qGiFz7uhkE5wE9IiSzPmLvCJQG0pBhOu4M2sZS+nc2IitGjvh5ZfRG5zNtBYYKoKS" crossorigin="anonymous"></script>
                            </body>
                        </html>`
            });
            return { status: 'success', result: 'Email enviado' };
        } catch (error) {
            return { status: 'error', error: error.message };
        }
    }

    async updatePassword(hashedPassword, resetToken) {
        try {
            const user = await User.findOne({ resetToken });
            if (!user) {
                return { status: 'error', error: 'Token inválido o expirado' };
            }

            const passwordHistory = user.passwordHistory || [];

            for (const pastPassword of passwordHistory) {
                const match = await bcrypt.compare(newPassword, pastPassword);

                if (match) {
                    return { status: 'error', error: 'La contraseña ya ha sido utilizada anteriormente, elija una nueva' };
                }
            }

            user.password = hashedPassword;
            user.passwordHistory = [...passwordHistory, hashedPassword];
            await user.save();

            return { status: 'success', message: 'Contraseña actualizada correctamente' };
        } catch (error) {
            return { status: 'error', error: error.message };
        }
    }

    async sendPurchaseConfirmationMail(email, purchaseDetails, productList) {
        try {
            let result = await this.transporter.sendMail({
                from: process.env.MAILING_USER,
                to: email,
                subject: 'Confirmación de Compra',
                html: `<!DOCTYPE html>
                        <html lang="es">
                        
                        <head>
                            <!-- Otros encabezados aquí -->
                        </head>
                        
                        <body>
                            <div class="container">
                                <div class="row">
                                    <div class="col-md-12">
                                        <h1>¡Gracias por tu compra!</h1>
                                        <p>Detalles de la compra:</p>
                                        <ul>
                                        ${productList.map(item => `
                                            <li>
                                            <img src="${item.productId.thumbnail}" alt="${item.productId.title}" style="max-width: 100px; max-height: 100px;"><br>
                                                <strong>Item:</strong> ${item.productId.title}<br>
                                                <strong>Precio:</strong> $${item.productId.price}<br>
                                                <strong>Cantidad:</strong> ${item.quantity}
                                            </li>
                                        `).join('')}
                                    </ul>
                                        <ul>
                                            ${purchaseDetails.products.map(product => `<li>${product.status}</li> <li>usuario: ${product.purchaser}</li> <li>Fecha: ${product.purchase_datetime}</li> <li>Factura No.: ${product.code}</li>`).join('')}
                                        </ul>
                                        <p>Total: $${purchaseDetails.total}</p>
                                    </div>
                                </div>
                            </div>
                        
                            <!-- Otros scripts aquí -->
                        </body>
                        
                        </html>`,
                // Puedes agregar más adjuntos si es necesario
            });

            return { status: 'success', result: 'Email enviado' };
        } catch (error) {
            return { status: 'error', error: error.message };
        }
    }
    async sendProductDeletedEmail(ownerEmail, productName, productImg) {
        try {
            let result = await this.transporter.sendMail({
                from: process.env.MAILING_USER,
                to: ownerEmail,
                subject: 'Producto Eliminado',
                html: `<!DOCTYPE html>
                    <html lang="es">
                    
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                        <title>Producto Eliminado</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-MFjF0csQgzIUhUVs6FfFYT6Oh3U3ErV73YEGFmILsU3BpkCUln1f5BcDY7HpM7IgH" crossorigin="anonymous">
                    </head>
                    
                    <body>
                        <div class="container">
                            <div class="row">
                                <div class="col-md-12">
                                    <h1>Producto Eliminado en el ecommerce</h1>
                                    <p>El producto ${productName} ha sido eliminado.</p>
                                    <img src="${productImg}" alt="${productName}" style="max-width: 100px; max-height: 100px;"><br>
                                </div>
                            </div>
                        </div>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-qGiFz7uhkE5wE9IiSzPmLvCJQG0pBhOu4M2sZS+nc2IitGjvh5ZfRG5zNtBYYKoKS" crossorigin="anonymous"></script>
                    </body>
                    
                    </html>`
            });

            return { status: 'success', result: 'Email enviado' };
        } catch (error) {
            return { status: 'error', error: error.message };
        }
    }
    async sendAccountDeletedEmail(email) {
        try {
            let result = await this.transporter.sendMail({
                from: process.env.MAILING_USER,
                to: email,
                subject: 'Cuenta Eliminada por Inactividad',
                html: `<!DOCTYPE html>
                        <html lang="es">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                                <title>Cuenta Eliminada por Inactividad</title>
                                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-MFjF0csQgzIUhUVs6FfFYT6Oh3U3ErV73YEGFmILsU3BpkCUln1f5BcDY7HpM7IgH" crossorigin="anonymous">
                            </head>
                            <body>
                                <div class="container">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <h1>Cuenta Eliminada por Inactividad</h1>
                                            <p>Tu cuenta ha sido eliminada debido a la inactividad. Si deseas volver a utilizar nuestros servicios, por favor regístrate nuevamente.</p>
                                        </div>
                                    </div>
                                </div>
                                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-qGiFz7uhkE5wE9IiSzPmLvCJQG0pBhOu4M2sZS+nc2IitGjvh5ZfRG5zNtBYYKoKS" crossorigin="anonymous"></script>
                            </body>
                        </html>`
            });

            return { status: 'success', result: 'Email enviado' };
        } catch (error) {
            return { status: 'error', error: error.message };
        }
    }

}
export default MailService;
