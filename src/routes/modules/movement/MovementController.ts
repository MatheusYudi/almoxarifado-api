// Libs
import { Request, Response } from "express";

// Library
import { Movement } from "@library/database/entity";
import { MovementRepository } from "@library/database/repository";

// Decorators
import { Controller, Get, Middlewares, Post } from "@decorators/index";

// Enums
import { EnumEndpoints, EnumMovementTypes } from "@common/enums";

// Routes
import { RouteResponse } from "@routes/index";

// Middlewares
import { BaseController } from "@middlewares/index";

// Validators
import { MovementValidator } from "./MovementValidator";

interface IMovementItem extends Pick<Movement, "quantity"> {
    materialId: Movement["material"]["id"];
    materialRef: Movement["material"];
}

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
     * /movement/in/batch:
     *   post:
     *     summary: Cria uma movimentação para cada material informado
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
     *               reason: 'Entrada de material'
     *               items: [{ materialId: 1, quantity: 9 }]
     *             required:
     *               - userId
     *               - items
     *             properties:
     *               userId:
     *                 type: number
     *               reason:
     *                 type: string
     *               items:
     *                 description: Itens da movimentação
     *                 type: array
     *                 items:
     *                   type: object
     *                   required:
     *                     - materialId
     *                     - quantity
     *                   properties:
     *                     materialId:
     *                       type: number
     *                     quantity:
     *                       type: number
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
    @Post("/in/batch")
    @Middlewares(MovementValidator.post())
    public async in(req: Request, res: Response): Promise<void> {
        const { userRef, reason, items } = req.body;

        // para cada material gera uma movimentação
        await Promise.all(
            (items as IMovementItem[]).map(async ({ materialRef, quantity }) => {
                const newMovement: Partial<Movement> = {
                    user: userRef,
                    material: materialRef,
                    quantity,
                    reason,
                    type: EnumMovementTypes.IN
                };

                await new MovementRepository().insert(newMovement);
            })
        );

        RouteResponse.successCreate(res);
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
     *               reason: 'Saída avulsa'
     *               quantity: 9
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
     *               reason:
     *                 type: string
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
        const { userRef, materialRef, reason, quantity, type } = req.body;

        const newMovement: Partial<Movement> = {
            user: userRef,
            material: materialRef,
            reason,
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
