// Libs
import { Request, Response } from "express";

// Library
import { Requisition, RequisitionMaterial, Movement, User } from "@library/database/entity";
import { RequisitionRepository, MovementRepository } from "@library/database/repository";

// Decorators
import { Controller, Delete, Get, Middlewares, Post, Put } from "@decorators/index";

// Enums
import { EnumEndpoints, EnumMovementTypes } from "@common/enums";

// Routes
import { RouteResponse } from "@routes/index";

// Middlewares
import { BaseController } from "@middlewares/index";

// Validators
import { RequisitionValidator } from "./RequisitionValidator";

interface IAddRequisitionItem extends Pick<RequisitionMaterial, "quantity"> {
    materialId: RequisitionMaterial["material"]["id"];
    materialRef: RequisitionMaterial["material"];
}

interface IUpdateRequisitionItem extends Pick<RequisitionMaterial, "id" | "quantity"> {
    requisitionMaterialRef: RequisitionMaterial;
}

@Controller(EnumEndpoints.REQUISITION)
export class RequisitionController extends BaseController {
    /**
     * @swagger
     *
     * /requisition:
     *   get:
     *     summary: Lista as requisições
     *     tags: [Requisition]
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
        const [rows, count] = await new RequisitionRepository().list<Requisition>(RequisitionController.listParams(req));

        RouteResponse.success({ rows, count }, res);
    }

    /**
     * @swagger
     *
     * /requisition:
     *   post:
     *     summary: Cria uma requisição
     *     tags: [Requisition]
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
     *               items: [{ materialId: 1, quantity: 9 }]
     *             required:
     *               - userId
     *               - items
     *             properties:
     *               userId:
     *                 type: number
     *               items:
     *                 description: Itens da requisição
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
    @Post()
    @Middlewares(RequisitionValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const { userRef, items } = req.body;

        const materials: RequisitionMaterial[] = (items as IAddRequisitionItem[]).map(item => {
            const { materialRef, quantity } = item;
            const requisitionMaterial: RequisitionMaterial = new RequisitionMaterial();

            requisitionMaterial.material = materialRef;
            requisitionMaterial.quantity = quantity;

            return requisitionMaterial;
        });

        const newRequisition: Partial<Requisition> = {
            user: userRef,
            requisitionMaterials: materials
        };

        await new RequisitionRepository().insert(newRequisition);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     *
     * /requisition:
     *   put:
     *     summary: Altera uma requisição
     *     tags: [Requisition]
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
     *               requisitionId: 1
     *               items: [{ id: 1, quantity: 9 }]
     *             required:
     *               - requisitionId
     *               - items
     *             properties:
     *               requisitionId:
     *                 type: number
     *               items:
     *                 description: Itens da requisição
     *                 type: array
     *                 items:
     *                   type: object
     *                   required:
     *                     - id
     *                     - quantity
     *                   properties:
     *                     id:
     *                       description: ID do item da requisição
     *                       type: number
     *                     quantity:
     *                       type: number
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
    @Middlewares(RequisitionValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const { requisitionRef, items } = req.body;

        if (requisitionRef.closed) {
            RouteResponse.error("Requisição já aprovada", res);
        } else {
            const materials: RequisitionMaterial[] = (items as IUpdateRequisitionItem[]).map(item => {
                const { requisitionMaterialRef, quantity } = item;

                return {
                    ...requisitionMaterialRef,
                    quantity
                } as RequisitionMaterial;
            });

            const requisition: Requisition = {
                ...requisitionRef,
                requisitionMaterials: materials
            };

            await new RequisitionRepository().update(requisition);

            RouteResponse.successCreate(res);
        }
    }

    /**
     * @swagger
     *
     * /requisition/balance:
     *   get:
     *     summary: Retorna a quantidade de requisições aprovadas/pendentes
     *     tags: [Requisition]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
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
    @Get("/balance")
    public async count(req: Request, res: Response): Promise<void> {
        const userId: User["id"] = req.body.userRef.id;
        const repository: RequisitionRepository = new RequisitionRepository();
        const approvedCount: number = await repository.count<Requisition>({ where: { approved: true, user: { id: userId } } });
        const pendingCount: number = await repository.count<Requisition>({ where: { approved: false, user: { id: userId } } });

        RouteResponse.success({ approved: approvedCount, pending: pendingCount }, res);
    }

    /**
     * @swagger
     *
     * /requisition/{id}:
     *   get:
     *     summary: Retorna informações de uma requisição
     *     tags: [Requisition]
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
    @Middlewares(RequisitionValidator.onlyId())
    public async getOne(req: Request, res: Response): Promise<void> {
        RouteResponse.success({ ...req.body.requisitionRef }, res);
    }

    /**
     * @swagger
     *
     * /requisition/{id}/approve:
     *   post:
     *     summary: Aprova uma requisição
     *     tags: [Requisition]
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
     *           type: string
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
    @Post("/:id/approve")
    @Middlewares(RequisitionValidator.onlyId())
    public async approve(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { userRef, requisitionRef } = req.body;

        // finaliza a requisição
        const requisition: Requisition = await new RequisitionRepository().update({
            ...requisitionRef,
            approved: true
        });

        // para cada RequisitionMaterial gera uma movimentação
        await Promise.all(
            requisition.requisitionMaterials.map(async ({ material, quantity }: RequisitionMaterial) => {
                const newMovement: Partial<Movement> = {
                    user: userRef,
                    material,
                    quantity,
                    type: EnumMovementTypes.OUT,
                    reason: "Saída por requisição"
                };

                await new MovementRepository().insert(newMovement);
            })
        );

        RouteResponse.success({ id }, res);
    }

    /**
     * @swagger
     *
     * /requisition/{id}:
     *   delete:
     *     summary: Remove uma requisição
     *     tags: [Requisition]
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
    @Middlewares(RequisitionValidator.onlyId())
    public async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        if (req.body.requisitionRef.closed) {
            RouteResponse.error("Requisição já aprovada", res);
        } else {
            await new RequisitionRepository().delete(id);
            RouteResponse.success({ id }, res);
        }
    }
}
