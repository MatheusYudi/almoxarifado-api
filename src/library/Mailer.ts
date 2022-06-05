// Libs
import Mail from "nodemailer/lib/mailer";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

// Decorators
import { Singleton } from "@decorators/Singleton";

interface ISenderInfo {
    email: string;
    name?: string;
}

@Singleton
export class Mailer {
    private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

    constructor() {
        this.transporter = nodemailer.createTransport({
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
    }

    /**
     * sendRecoveryEmail
     *
     * @param receiver - Email e nome do destinatário
     * @param resetUrl - Endereço da aplicação para recuperar a senha
     *
     * @returns Informações de envio
     */
    public sendRecoveryEmail({ email: toEmail, name: toName }: ISenderInfo, resetUrl: string): Promise<SMTPTransport.SentMessageInfo> {
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
                        body {
                            font-family: 'Roboto', sans-serif;
                        }
                        h1 {
                            font-size: 18px;
                            font-weight: bold;
                            margin-top: 20px;
                        }
                        hr {
                            margin: 20px 0px;
                        }
                        #main {
                            background-color: white;
                            display: block;
                            margin: auto;
                            max-width: 600px;
                        }
                        #logo {
                            display: block;
                            margin: 0px auto;
                            width: 50%;
                        }
                    </style>
                </head>
                <body>
                    <div id="main">
                        <h1>Olá, ${toName}</h1>
                        <p>Você solicitou a recuperação da sua senha</p>
                        <p>Clique <a id="reset_password" target="_blank" href="${resetUrl}">aqui</a> para criar uma nova senha e recuperar o seu acesso.</p>
                        <hr />
                        <img id="logo" alt="Inspect with Tabs" src="https://assets-examples.mailtrap.io/integration-examples/welcome.png">
                    </div>
                </body>
            </html>`
        };

        return this.transporter.sendMail(mailOptions);
    }

    public sendPurchaseRequestEmail(sender: ISenderInfo, receiver: ISenderInfo, tableRows: string[]): Promise<SMTPTransport.SentMessageInfo> {
        const mailOptions: Mail.Options = {
            from: `${sender.name} - Supervisor do Almoxarifado <${process.env.MAILER_USER}>`,
            to: receiver.email,
            cc: sender.email,
            subject: "Solicitação de compra - Almoxarifado",
            text: `Olá, <SETOR DE COMPRAS>`,
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
                        body {
                            font-family: 'Roboto', sans-serif;
                        }
                        h1 {
                            font-size: 18px;
                            font-weight: bold;
                            margin-top: 20px;
                        }
                        table {
                            border-collapse: collapse;
                            width: 100%;
                        }
                        td, th {
                            border: 1px solid #dddddd;
                            padding: 8px;
                            text-align: left;
                        }
                        hr {
                            margin: 20px 0px;
                        }
                        #main {
                            background-color: white;
                            display: block;
                            margin: auto;
                            max-width: 600px;
                        }
                        #table-container {
                            max-height: 200px;
                            overflow: auto;
                            scrollbar-width: thin;
                        }
                        #table-container::-webkit-scrollbar {
                            height: 10px;
                            width: 10px;
                        }
                        #table-container::-webkit-scrollbar-track,
                        ::-webkit-scrollbar-thumb {
                            border-radius: 100px;
                            border: 3px solid transparent;
                            background-clip: content-box;
                        }
                        #table-container::-webkit-scrollbar-thumb {
                            -webkit-box-shadow: inset 0 0 6px #00000080;
                            box-shadow: inset 0 0 6px #00000080;
                        }
                        #logo {
                            display: block;
                            margin: 0px auto;
                            width: 50%;
                        }
                    </style>
                </head>
                <body>
                    <div id="main">
                        <h1>Olá, <SETOR DE COMPRAS></h1>
                        <p>Segue relação dos materiais solicitados para a compra:</p>
                        <div id="table-container">
                            <table role="presentation" border="0" cellspacing="0" width="100%">
                                ${tableRows.join("")}
                            </table>
                        </div>
                        <hr />
                        <img id="logo" alt="Inspect with Tabs" src="https://assets-examples.mailtrap.io/integration-examples/welcome.png">
                    </div>
                </body>
            </html>`
        };

        return this.transporter.sendMail(mailOptions);
    }
}
