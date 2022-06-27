// Libs
import { Request, Response } from "express";

// Library
import { AccessGroup } from "@library/database/entity";
import { AccessGroupRepository } from "@library/database/repository";

// Decorators
import { Controller, Delete, Get, Middlewares, Post, Put } from "@decorators/index";

// Enums
import { EnumEndpoints } from "@common/enums";

// Routes
import { RouteResponse } from "@routes/index";

// Middlewares
import { BaseController } from "@middlewares/index";

// Validators
import { AccessGroupValidator } from "./AccessGroupValidator";

@Controller(EnumEndpoints.ACCESS_GROUP)
export class AccessGroupController extends BaseController {
    /**
     * @swagger
     *
     * /access-group:
     *   get:
     *     summary: Lista os grupos de acesso
     *     tags: [Access Group]
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
        const [rows, count] = await new AccessGroupRepository().list<AccessGroup>(AccessGroupController.listParams(req));

        RouteResponse.success({ rows, count }, res);
    }

    /**
     * @swagger
     *
     * /access-group/{id}:
     *   get:
     *     summary: Retorna informações de um grupo de acesso
     *     tags: [Access Group]
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
    @Middlewares(AccessGroupValidator.onlyId())
    public async getOne(req: Request, res: Response): Promise<void> {
        RouteResponse.success({ ...req.body.accessGroupRef }, res);
    }

    /**
     * @swagger
     *
     * /access-group:
     *   post:
     *     summary: Cria um grupo de acesso
     *     tags: [Access Group]
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
     *               name: accessGroupName
     *             required:
     *               - name
     *             properties:
     *               name:
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
    @Middlewares(AccessGroupValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        await new AccessGroupRepository().insert({ name: req.body.name });

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     *
     * /access-group:
     *   put:
     *     summary: Altera um grupo de acesso
     *     tags: [Access Group]
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
     *               name: accessGroupName
     *             required:
     *               - id
     *             properties:
     *               id:
     *                 type: number
     *               name:
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
    @Middlewares(AccessGroupValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const { accessGroupRef, name } = req.body;

        await new AccessGroupRepository().update({ ...accessGroupRef, name });

        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     *
     * /access-group/{id}:
     *   delete:
     *     summary: Remove um grupo de acesso
     *     tags: [Access Group]
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
    @Middlewares(AccessGroupValidator.delete())
    public async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await new AccessGroupRepository().delete(id);

        RouteResponse.success({ id }, res);
    }
}
