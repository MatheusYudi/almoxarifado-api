// Libs
import { Request, Response } from "express";

// Decorators
import { Controller, Middlewares, Post, PublicRoute, Put } from "@decorators/index";

// Library
import { Mailer } from "@library/Mailer";
import { User } from "@library/database/entity";
import { UserRepository } from "@library/database/repository";

// Enums
import { EnumEndpoints } from "@common/enums";

// Routes
import { RouteResponse } from "@routes/index";

// Middlewares
import { BaseController } from "@middlewares/index";

// Utils
import { CryptoUtils, TokenUtils } from "@common/utils";

// Validators
import { AuthValidator } from "./AuthValidator";

@Controller(EnumEndpoints.AUTH)
export class AuthController extends BaseController {
    /**
     * @swagger
     *
     * /auth/login:
     *   post:
     *     summary: Realiza login na plataforma
     *     tags: [Auth]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             example:
     *               email: admin@email.com
     *               password: admin_pass
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         $ref: '#/components/responses/200'
     *       400:
     *         $ref: '#/components/responses/400'
     *       401:
     *         $ref: '#/components/responses/401'
     *       500:
     *         $ref: '#/components/responses/500'
     */
    @PublicRoute()
    @Post("/login")
    @Middlewares(AuthValidator.login())
    public async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        const userRef: Partial<User> | undefined = await new UserRepository().findByEmailOrDocument(email, true);
        const hashedPassword: string = CryptoUtils.sha512(password || "", userRef?.salt || "");

        if (userRef && hashedPassword === userRef.password) {
            const { id, name, email: userEmail, accessGroup } = userRef;
            const accessToken: string = TokenUtils.create({ id });

            RouteResponse.success({ id, name, email: userEmail, accessGroup, accessToken }, res);
        } else {
            RouteResponse.unauthorizedError(res, "Usuário ou senha inválida");
        }
    }

    /**
     * @swagger
     *
     * /auth/recover:
     *   post:
     *     summary: Dispara email de recuperação de senha
     *     tags: [Auth]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             example:
     *               email: user_email@email.com
     *               resetUrl: https://www.my-app.com/resetPage
     *             required:
     *               - email
     *               - resetUrl
     *             properties:
     *               email:
     *                 type: string
     *                 description: Email do usuário
     *               resetUrl:
     *                 type: string
     *                 description: Endereço da aplicação para recuperar a senha
     *     responses:
     *       200:
     *         $ref: '#/components/responses/200'
     *       400:
     *         $ref: '#/components/responses/400'
     *       500:
     *         $ref: '#/components/responses/500'
     */
    @PublicRoute()
    @Post("/recover")
    @Middlewares(AuthValidator.recoverPassword())
    public async recoverPassword(req: Request, res: Response): Promise<void> {
        const errorMessage = "Erro ao solicitar a redefinição de senha";
        const { email, resetUrl } = req.body;

        const user: User | undefined = await new UserRepository().findByEmailOrDocument(email);

        if (user) {
            try {
                const resetToken: string = TokenUtils.create({ id: user.id });

                await new Mailer().sendRecoveryEmail({ email, name: user.name }, `${resetUrl}/${resetToken}`);

                RouteResponse.success("Redefinição de senha solicitada com sucesso. Confira as instruções no seu email.", res);
            } catch (error) {
                RouteResponse.error(errorMessage, res);
            }
        } else {
            RouteResponse.error(errorMessage, res);
        }
    }

    /**
     * @swagger
     *
     * /auth/reset:
     *   put:
     *     summary: Redefine a senha do usuário
     *     tags: [Auth]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: header
     *         name: x-reset-token
     *         schema:
     *           type: string
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             example:
     *               password: new_user_password
     *             required:
     *               - password
     *             properties:
     *               password:
     *                 type: string
     *                 description: Nova senha
     *     responses:
     *       200:
     *         $ref: '#/components/responses/200'
     *       400:
     *         $ref: '#/components/responses/400'
     *       500:
     *         $ref: '#/components/responses/500'
     */
    @PublicRoute()
    @Put("/reset")
    @Middlewares(AuthValidator.resetPassword())
    public async resetPassword(req: Request, res: Response): Promise<void> {
        const { decodedToken, password } = req.body;

        try {
            await new UserRepository().changePassword(decodedToken.id, password);
            RouteResponse.successEmpty(res);
        } catch (error) {
            RouteResponse.error("Erro ao redefinir a senha", res);
        }
    }
}
