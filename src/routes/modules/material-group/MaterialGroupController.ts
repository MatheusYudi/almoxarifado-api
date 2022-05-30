// Libs
import { Request, Response } from "express";

// Library
import { MaterialGroup } from "@library/database/entity";
import { MaterialGroupRepository } from "@library/database/repository";

// Decorators
import { Controller, Delete, Get, Middlewares, Post, Put } from "@decorators/index";

// Enums
import { EnumEndpoints } from "@common/enums";

// Routes
import { RouteResponse } from "@routes/index";

// Middlewares
import { BaseController } from "@middlewares/index";

// Validators
import { MaterialGroupValidator } from "./MaterialGroupValidator";

@Controller(EnumEndpoints.MATERIAL_GROUP)
export class MaterialGroupController extends BaseController {
    /**
     * @swagger
     *
     * /material-group:
     *   get:
     *     summary: Lista os grupos de material
     *     tags: [Material Groups]
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
        const [rows, count] = await new MaterialGroupRepository().list<MaterialGroup>(MaterialGroupController.listParams(req));

        RouteResponse.success({ rows, count }, res);
    }

    /**
     * @swagger
     *
     * /material-group/{materialGroupId}:
     *   get:
     *     summary: Retorna informações de um grupo de material
     *     tags: [Material Groups]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: materialGroupId
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
    @Middlewares(MaterialGroupValidator.onlyId())
    public async getOne(req: Request, res: Response): Promise<void> {
        RouteResponse.success({ ...req.body.materialGroupRef }, res);
    }

    /**
     * @swagger
     *
     * /material-group:
     *   post:
     *     summary: Cria um grupo de material
     *     tags: [Material Groups]
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
     *               name: materialGroupName
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
    @Middlewares(MaterialGroupValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        await new MaterialGroupRepository().insert({ name: req.body.name });

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     *
     * /material-group:
     *   put:
     *     summary: Altera um grupo de material
     *     tags: [Material Groups]
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
     *               name: materialGroupName
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
    @Middlewares(MaterialGroupValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const { materialGroupRef, name } = req.body;

        await new MaterialGroupRepository().update({ ...materialGroupRef, name });

        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     *
     * /material-group/{materialGroupId}:
     *   delete:
     *     summary: Remove um grupo de material
     *     tags: [Material Groups]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: materialGroupId
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
    @Middlewares(MaterialGroupValidator.onlyId())
    public async remove(req: Request, res: Response): Promise<void> {
        const { materialGroupRef } = req.body;
        const { id } = req.params;
        const materialGroupRepository: MaterialGroupRepository = new MaterialGroupRepository();

        // Seta status inativo
        (materialGroupRef as MaterialGroup).setRemoveStatus();

        await materialGroupRepository.update(materialGroupRef);
        await materialGroupRepository.delete(id);

        RouteResponse.success({ id }, res);
    }
}
