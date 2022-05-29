// Libs
import Mail from "nodemailer/lib/mailer";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export class Mailer {
    /**
     * sendRecoveryEmail
     *
     * @param toEmail - Email do destinatário
     * @param toName - Nome do destinatário
     * @param resetUrl - Endereço da aplicação para recuperar a senha
     *
     * @returns Informações de envio
     */
    public static sendRecoveryEmail(toEmail: string, toName: string, resetUrl: string): Promise<SMTPTransport.SentMessageInfo> {
        const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions: Mail.Options = {
            from: `noreply@almoxarifado <${process.env.MAILER_USER}>`,
            to: toEmail,
            subject: "Recuperação de senha - Almoxarifado",
            text: `Olá, ${toName}`,
            html: `<!doctype html>
            <html>
              <head>
                <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
                <style>
                  .main { background-color: white; }
                  a:hover { border-left-width: 1em; min-height: 2em; }
                </style>
              </head>
              <body style="font-family: 'Roboto', sans-serif;">
                <div style="display: block; margin: auto; max-width: 600px;" class="main">
                  <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Olá, ${toName}</h1>
                  <p>Você solicitou a recuperação da sua senha</p>
                  <img alt="Inspect with Tabs" src="https://assets-examples.mailtrap.io/integration-examples/welcome.png" style="width: 100%;">
                  <p>Clique <a id="reset_password" target="_blank" href="${resetUrl}">aqui</a> ou no link abaixo para criar uma nova senha e  recuperar o seu acesso.</p>
                  <p style="overflow-wrap: anywhere"><a id="reset_password" target="_blank" href="${resetUrl}">${resetUrl}</a></p>
                </div>
              </body>
            </html>`
        };

        return transporter.sendMail(mailOptions);
    }
}
