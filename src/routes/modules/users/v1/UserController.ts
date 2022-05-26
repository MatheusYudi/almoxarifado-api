// Libs
import { DeepPartial } from "typeorm";
import { Request, Response } from "express";

// Library
import { User } from "@library/database/entity";
import { UserRepository } from "@library/database/repository";

// Decorators
import { Controller, Delete, Get, Middlewares, Post, PublicRoute, Put } from "@decorators/index";

// Enums
import { EnumEndpoints } from "@common/enums";

// Routes
import { RouteResponse } from "@routes/index";

// Middlewares
import { BaseController } from "@middlewares/index";

// Validators
import { UserValidator } from "./UserValidator";

@Controller(EnumEndpoints.USER_V1)
export class UserController extends BaseController {
    /**
     * @swagger
     *
     * /v1/user:
     *   get:
     *     summary: Lista os usuários
     *     tags: [Users]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - $ref: '#/components/parameters/listPageRef'
     *       - $ref: '#/components/parameters/listSizeRef'
     *       - $ref: '#/components/parameters/listOrderRef'
     *       - $ref: '#/components/parameters/listOrderByRef'
     *     responses:
     *       '200':
     *         $ref: '#/components/responses/200'
     *       '400':
     *         $ref: '#/components/responses/400'
     *       '401':
     *         $ref: '#/components/responses/401'
     *       '500':
     *         $ref: '#/components/responses/500'
     */
    @Get()
    @PublicRoute()
    public async get(req: Request, res: Response): Promise<void> {
        const [rows, count] = await new UserRepository().list<User>(UserController.listParams(req));

        RouteResponse.success({ rows, count }, res);
    }

    /**
     * @swagger
     *
     * /v1/user/{userId}:
     *   get:
     *     summary: Retorna informações de um usuário
     *     tags: [Users]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       '200':
     *         $ref: '#/components/responses/200'
     *       '400':
     *         $ref: '#/components/responses/400'
     *       '401':
     *         $ref: '#/components/responses/401'
     *       '500':
     *         $ref: '#/components/responses/500'
     */
    @Get("/:id")
    @PublicRoute()
    @Middlewares(UserValidator.onlyId())
    public async getOne(req: Request, res: Response): Promise<void> {
        RouteResponse.success({ ...req.body.userRef }, res);
    }

    /**
     * @swagger
     *
     * /v1/user:
     *   post:
     *     summary: Cadastra um usuário
     *     tags: [Users]
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
     *               name: userName
     *             required:
     *               - name
     *             properties:
     *               name:
     *                 type: string
     *     responses:
     *       '201':
     *         $ref: '#/components/responses/201'
     *       '400':
     *         $ref: '#/components/responses/400'
     *       '401':
     *         $ref: '#/components/responses/401'
     *       '500':
     *         $ref: '#/components/responses/500'
     */
    @Post()
    @PublicRoute()
    @Middlewares(UserValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const newUser: DeepPartial<User> = {
            name: req.body.name
        };

        await new UserRepository().insert(newUser);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     *
     * /v1/user:
     *   put:
     *     summary: Altera um usuário
     *     tags: [Users]
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
     *               id: userId
     *               name: userName
     *             required:
     *               - id
     *               - name
     *             properties:
     *               id:
     *                 type: string
     *               name:
     *                 type: string
     *     responses:
     *       '204':
     *         $ref: '#/components/responses/204'
     *       '400':
     *         $ref: '#/components/responses/400'
     *       '401':
     *         $ref: '#/components/responses/401'
     *       '500':
     *         $ref: '#/components/responses/500'
     */
    @Put()
    @PublicRoute()
    @Middlewares(UserValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const user: User = req.body.userRef;

        user.name = req.body.name;

        await new UserRepository().update(user);

        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     *
     * /v1/user/{userId}:
     *   delete:
     *     summary: Apaga um usuário definitivamente
     *     tags: [Users]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       '200':
     *         $ref: '#/components/responses/200'
     *       '400':
     *         $ref: '#/components/responses/400'
     *       '401':
     *         $ref: '#/components/responses/401'
     *       '500':
     *         $ref: '#/components/responses/500'
     */
    @Delete("/:id")
    @PublicRoute()
    @Middlewares(UserValidator.onlyId())
    public async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await new UserRepository().delete(id);

        RouteResponse.success({ id }, res);
    }
}
