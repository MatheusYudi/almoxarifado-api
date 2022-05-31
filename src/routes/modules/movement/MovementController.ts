// Libs
import { Request, Response } from "express";

// Library
import { Movement } from "@library/database/entity";
import { MovementRepository } from "@library/database/repository";

// Decorators
import { Controller, Get, Middlewares, Post } from "@decorators/index";

// Enums
import { EnumEndpoints } from "@common/enums";

// Routes
import { RouteResponse } from "@routes/index";

// Middlewares
import { BaseController } from "@middlewares/index";

// Validators
import { MovementValidator } from "./MovementValidator";

@Controller(EnumEndpoints.MOVEMENT)
export class MovementController extends BaseController {
    /**
     * @swagger
     *
     * /movement:
     *   get:
     *     summary: Lista as movimentações
     *     tags: [Movement]
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
        const [rows, count] = await new MovementRepository().list<Movement>(MovementController.listParams(req));

        RouteResponse.success({ rows, count }, res);
    }

    /**
     * @swagger
     *
     * /movement:
     *   post:
     *     summary: Cria uma movimentação
     *     tags: [Movement]
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
     *               userId: 1
     *               materialId: 1
     *               quantity: 99
     *               type: 'Saída'
     *             required:
     *               - userId
     *               - materialId
     *               - quantity
     *               - type
     *             properties:
     *               userId:
     *                 type: number
     *               materialId:
     *                 type: number
     *               quantity:
     *                 type: number
     *               type:
     *                 description: Tipo da movimentação
     *                 type: string
     *                 enum: ['Entrada', 'Saída']
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
    @Middlewares(MovementValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const { userRef: user, materialRef: material, quantity, type } = req.body;

        const newMovement: Partial<Movement> = {
            user,
            material,
            quantity,
            type
        };

        await new MovementRepository().insert(newMovement);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     *
     * /movement/{id}:
     *   get:
     *     summary: Retorna informações de uma movimentação
     *     tags: [Movement]
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
    @Middlewares(MovementValidator.onlyId())
    public async getOne(req: Request, res: Response): Promise<void> {
        RouteResponse.success({ ...req.body.movementRef }, res);
    }
}
