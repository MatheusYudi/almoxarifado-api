// Libs
import { Request, Response } from "express";

// Library
import { User } from "@library/database/entity";
import { UserRepository } from "@library/database/repository";

// Decorators
import { Controller, Delete, Get, Middlewares, Post, Put } from "@decorators/index";

// Enums
import { EnumEndpoints } from "@common/enums";

// Routes
import { RouteResponse } from "@routes/index";

// Middlewares
import { BaseController } from "@middlewares/index";

// Validators
import { UserValidator } from "./UserValidator";

@Controller(EnumEndpoints.USER)
export class UserController extends BaseController {
    /**
     * @swagger
     *
     * /user:
     *   get:
     *     summary: Lista os usuários
     *     tags: [User]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - $ref: '#/components/parameters/listPageRef'
     *       - $ref: '#/components/parameters/listSizeRef'
     *       - $ref: '#/components/parameters/listOrderRef'
     *       - $ref: '#/components/parameters/listOrderByRef'
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
    @Get()
    public async get(req: Request, res: Response): Promise<void> {
        const [rows, count] = await new UserRepository().list<User>(UserController.listParams(req));

        const usersMap: User[] = rows.map((item: User) => {
            const data: any = { ...item };

            delete data.password;
            delete data.salt;

            return data;
        });

        RouteResponse.success({ rows: usersMap, count }, res);
    }

    /**
     * @swagger
     *
     * /user/{id}:
     *   get:
     *     summary: Retorna informações de um usuário
     *     tags: [User]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: number
     *         required: true
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
    @Get("/:id")
    @Middlewares(UserValidator.onlyId())
    public async getOne(req: Request, res: Response): Promise<void> {
        const user: Partial<User> = { ...req.body.userRef };

        delete user.password;
        delete user.salt;

        RouteResponse.success(user, res);
    }

    /**
     * @swagger
     *
     * /user:
     *   post:
     *     summary: Cria um usuário
     *     tags: [User]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             example:
     *               accessGroupId: 1
     *               name: 'userName'
     *               document: '809.562.280-03'
     *               email: 'user_email@email.com'
     *               password: 'user_password'
     *             required:
     *               - accessGroupId
     *               - name
     *               - document
     *               - email
     *               - password
     *             properties:
     *               accessGroupId:
     *                 type: number
     *               name:
     *                 type: string
     *               document:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       201:
     *         $ref: '#/components/responses/201'
     *       400:
     *         $ref: '#/components/responses/400'
     *       401:
     *         $ref: '#/components/responses/401'
     *       500:
     *         $ref: '#/components/responses/500'
     */
    @Post()
    @Middlewares(UserValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const { accessGroupRef, name, document, email, password } = req.body;

        const newUser: Partial<User> = {
            accessGroup: accessGroupRef,
            name,
            document,
            email,
            password
        };

        await new UserRepository().insert(newUser);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     *
     * /user:
     *   put:
     *     summary: Altera um usuário
     *     tags: [User]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             example:
     *               id: 1
     *               accessGroupId: 1
     *               name: 'userName'
     *               document: '809.562.280-03'
     *               email: 'user_email@email.com'
     *               password: 'user_password'
     *             required:
     *               - id
     *             properties:
     *               id:
     *                 type: number
     *               accessGroupId:
     *                 type: number
     *               name:
     *                 type: string
     *               document:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       204:
     *         $ref: '#/components/responses/204'
     *       400:
     *         $ref: '#/components/responses/400'
     *       401:
     *         $ref: '#/components/responses/401'
     *       500:
     *         $ref: '#/components/responses/500'
     */
    @Put()
    @Middlewares(UserValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const { accessGroupRef, userRef, name, document, email, password } = req.body;
        // Remove a senha para evitar sobrescrição
        delete userRef.password;

        const user: User = userRef;
        user.accessGroup = accessGroupRef;
        user.name = name;
        user.document = document;
        user.email = email;

        if (password) {
            user.password = password;
        }

        await new UserRepository().update(user);

        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     *
     * /user/{id}:
     *   delete:
     *     summary: Remove um usuário
     *     tags: [User]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: number
     *         required: true
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
    @Delete("/:id")
    @Middlewares(UserValidator.delete())
    public async remove(req: Request, res: Response): Promise<void> {
        const { userRef } = req.body;
        const { id } = req.params;
        const userRepository: UserRepository = new UserRepository();

        // Seta status inativo
        (userRef as User).setRemoveStatus();

        await userRepository.update(userRef);
        await userRepository.delete(id);

        RouteResponse.success({ id }, res);
    }
}
