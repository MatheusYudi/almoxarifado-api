// Libs
import { Request, Response } from "express";

// Decorators
import { Controller, Middlewares, Post, PublicRoute, Put } from "@decorators/index";

// Repositories
import { UserRepository } from "@library/database/repository";

// Entities
import { User } from "@library/database/entity";

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
        const userRef: User | undefined = await new UserRepository().findByEmailOrDocument(email);
        const hashedPassword: string = CryptoUtils.sha512(password, userRef?.salt || "");

        if (userRef && hashedPassword === userRef.password) {
            const accessToken: string = TokenUtils.create({ id: userRef?.id });
            RouteResponse.success({ ...userRef, accessToken }, res);
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
    public async recoverPassword(_req: Request, res: Response): Promise<void> {
        // TODO: trigger email
        RouteResponse.success("Redefinição de senha solicitada com sucesso. Confira as instruções no seu email.", res);
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
            throw new Error("Erro ao redefinir a senha");
        }
    }
}
