import { config } from "../config/config.js";

const PORT = config.PORT;

const createRecoveryPasswordEmailWith = (token) => {
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

const createInactiveUserEmail = (userEmail) => {
    const registrationEndpoint = `http://localhost:${PORT}/register`;
    const emailBody = `
    <div className="bg-gray-100 p-6 dark:bg-gray-800">
      <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md dark:bg-gray-950">
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4 dark:border-gray-700">
            <h1 className="text-2xl font-bold">Cuenta de usuario eliminada</h1>
          </div>
          <div className="space-y-2">
            <p>Lamentamos informarle que su cuenta ha sido eliminada debido a inactividad por más de 2 días.</p>
            <p>
              Si desea reactivar su cuenta, por favor
              <a href=${registrationEndpoint} className="font-medium underline" prefetch={false}>
                regístrate de nuevo
              </a>
              .
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Agradecemos su comprensión y esperamos tenerlo nuevamente en nuestra plataforma.
            </p>
          </div>
          <div className="flex justify-end">
            <a
              href=${registrationEndpoint}
              className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-900/90 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus:ring-gray-300"
              prefetch={false}
            >
              Regístrate de nuevo
            </a>
          </div>
        </div>
      </div>
    </div>`

  return emailBody;
}

export { 
  createRecoveryPasswordEmailWith,
  createInactiveUserEmail
}