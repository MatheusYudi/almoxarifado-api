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
     *     tags: [Users]
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
     * /user/{userId}:
     *   get:
     *     summary: Retorna informações de um usuário
     *     tags: [Users]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: userId
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
     *     tags: [Users]
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
     *               name: userName
     *               document: 809.562.280-03
     *               email: user_email@email.com
     *               password: user_password
     *             required:
     *               - name
     *               - document
     *               - email
     *               - password
     *             properties:
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
        // TODO: add group link (accessGroupId)

        const newUser: Partial<User> = {
            name: req.body.name,
            document: req.body.document,
            email: req.body.email,
            password: req.body.password
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
     *     tags: [Users]
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
     *               name: userName
     *               document: 809.562.280-03
     *               email: user_email@email.com
     *               password: user_password
     *             required:
     *               - id
     *             properties:
     *               id:
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
        // TODO: add group link (accessGroupId)

        const user: User = req.body.userRef;

        user.name = req.body.name;
        user.document = req.body.document;
        user.email = req.body.email;
        user.password = req.body.password;

        await new UserRepository().update(user);

        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     *
     * /user/{userId}:
     *   delete:
     *     summary: Remove um usuário
     *     tags: [Users]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: userId
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
    @Middlewares(UserValidator.onlyId())
    public async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await new UserRepository().delete(id);

        RouteResponse.success({ id }, res);
    }
}
