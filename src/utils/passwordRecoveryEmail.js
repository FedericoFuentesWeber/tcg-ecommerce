import { config } from "../config/config.js";

const PORT = config.PORT;

const createEmailWith = (token) => {
    const expiredTokenEndpoint = `http://localhost:${PORT}/recoverPassword`;
    const changePasswordEndpoint = `http://localhost:${PORT}/changePassword?token=${token}`;


    const emailBody = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperación de Contraseña</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td style="padding: 20px 0; text-align: center;">
                    <h1 style="color: #007bff;">Recuperación de Contraseña</h1>
                    <p>Hemos recibido una solicitud para restablecer tu contraseña. Si no realizaste esta solicitud, puedes ignorar este correo electrónico.</p>
                    <p>Para restablecer tu contraseña, haz clic en el botón a continuación:</p>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td align="center">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td>
                                            <a href=${changePasswordEndpoint} target="_blank" style="background-color: #007bff; color: #ffffff; display: inline-block; font-size: 14px; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Restablecer Contraseña</a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <p>Este enlace caducará en una hora.</p>
                    <p>Si han pasado más de una hora, puedes solicitar un nuevo correo electrónico para restablecer la contraseña <a href=${expiredTokenEndpoint} target="_blank" style="color: #007bff; text-decoration: none;">aquí</a>.</p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `

    return emailBody;
}

export { createEmailWith }