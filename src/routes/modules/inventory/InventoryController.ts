// Libs
import { Request, Response } from "express";

// Library
import { Inventory, InventoryMaterial, Movement } from "@library/database/entity";
import { InventoryRepository, MovementRepository } from "@library/database/repository";

// Decorators
import { Controller, Delete, Get, Middlewares, Post, Put } from "@decorators/index";

// Enums
import { EnumEndpoints, EnumMovementTypes } from "@common/enums";

// Routes
import { RouteResponse } from "@routes/index";

// Middlewares
import { BaseController } from "@middlewares/index";

// Validators
import { InventoryValidator } from "./InventoryValidator";

interface IAddInventoryItem extends Pick<InventoryMaterial, "systemQuantity" | "physicQuantity"> {
    materialId: InventoryMaterial["material"]["id"];
    materialRef: InventoryMaterial["material"];
}

interface IUpdateInventoryItem extends Pick<InventoryMaterial, "id" | "systemQuantity" | "physicQuantity"> {
    inventoryMaterialRef: InventoryMaterial;
}

@Controller(EnumEndpoints.INVENTORY)
export class InventoryController extends BaseController {
    /**
     * @swagger
     *
     * /inventory:
     *   get:
     *     summary: Lista os inventários
     *     tags: [Inventory]
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
        const [rows, count] = await new InventoryRepository().list<Inventory>(InventoryController.listParams(req));

        RouteResponse.success({ rows, count }, res);
    }

    /**
     * @swagger
     *
     * /inventory:
     *   post:
     *     summary: Cria um inventário
     *     tags: [Inventory]
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
     *               items: [{ materialId: 1, systemQuantity: 9, physicQuantity: 29 }]
     *             required:
     *               - userId
     *               - items
     *             properties:
     *               userId:
     *                 type: number
     *               items:
     *                 description: Itens do inventário
     *                 type: array
     *                 items:
     *                   type: object
     *                   required:
     *                     - materialId
     *                     - systemQuantity
     *                     - physicQuantity
     *                   properties:
     *                     materialId:
     *                       type: number
     *                     systemQuantity:
     *                       type: number
     *                     physicQuantity:
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
    @Middlewares(InventoryValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const { userRef, items } = req.body;

        const materials: InventoryMaterial[] = (items as IAddInventoryItem[]).map(item => {
            const { materialRef, physicQuantity, systemQuantity } = item;
            const inventoryMaterial: InventoryMaterial = new InventoryMaterial();

            inventoryMaterial.material = materialRef;
            inventoryMaterial.physicQuantity = physicQuantity;
            inventoryMaterial.systemQuantity = systemQuantity;

            return inventoryMaterial;
        });

        const newInventory: Partial<Inventory> = {
            user: userRef,
            inventoryMaterials: materials
        };

        await new InventoryRepository().insert(newInventory);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     *
     * /inventory:
     *   put:
     *     summary: Altera um inventário
     *     tags: [Inventory]
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
     *               inventoryId: 1
     *               items: [{ id: 1, systemQuantity: 9, physicQuantity: 29 }]
     *             required:
     *               - inventoryId
     *               - items
     *             properties:
     *               inventoryId:
     *                 type: number
     *               items:
     *                 description: Itens do inventário
     *                 type: array
     *                 items:
     *                   type: object
     *                   required:
     *                     - id
     *                     - systemQuantity
     *                     - physicQuantity
     *                   properties:
     *                     id:
     *                       description: ID do item do inventário
     *                       type: number
     *                     systemQuantity:
     *                       type: number
     *                     physicQuantity:
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
    @Middlewares(InventoryValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const { inventoryRef, items } = req.body;

        if (inventoryRef.closed) {
            throw new Error("Inventário finalizado");
        }

        const materials: InventoryMaterial[] = (items as IUpdateInventoryItem[]).map(item => {
            const { inventoryMaterialRef, physicQuantity, systemQuantity } = item;

            return {
                ...inventoryMaterialRef,
                physicQuantity,
                systemQuantity
            } as InventoryMaterial;
        });

        const inventory: Inventory = {
            ...inventoryRef,
            inventoryMaterials: materials
        };

        await new InventoryRepository().update(inventory);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     *
     * /inventory/{id}:
     *   get:
     *     summary: Retorna informações de um inventário
     *     tags: [Inventory]
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
    @Middlewares(InventoryValidator.onlyId())
    public async getOne(req: Request, res: Response): Promise<void> {
        RouteResponse.success({ ...req.body.inventoryRef }, res);
    }

    /**
     * @swagger
     *
     * /inventory/{id}/close:
     *   post:
     *     summary: Finaliza um inventário
     *     tags: [Inventory]
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
    @Post("/:id/close")
    @Middlewares(InventoryValidator.onlyId())
    public async close(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { userRef, inventoryRef } = req.body;

        // finaliza o inventário
        const inventory: Inventory = await new InventoryRepository().update({
            ...inventoryRef,
            closed: true
        });

        // para cada InventoryMaterial gera uma movimentação
        await Promise.all(
            inventory.inventoryMaterials.map(async ({ material, physicQuantity, systemQuantity }: InventoryMaterial) => {
                if (systemQuantity !== physicQuantity) {
                    const isMissing: boolean = physicQuantity > systemQuantity;

                    const newMovement: Partial<Movement> = {
                        user: userRef,
                        material,
                        // calcula a diferença entre as quantidades
                        quantity: isMissing ? physicQuantity - systemQuantity : systemQuantity - physicQuantity,
                        // se estiver faltando material no sistema, realiza uma entrada, caso contrário, uma saída
                        type: isMissing ? EnumMovementTypes.IN : EnumMovementTypes.OUT,
                        reason: "Correção de inventário"
                    };

                    await new MovementRepository().insert(newMovement);
                }
            })
        );

        RouteResponse.success({ id }, res);
    }

    /**
     * @swagger
     *
     * /inventory/{id}:
     *   delete:
     *     summary: Remove um inventário
     *     tags: [Inventory]
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
    @Middlewares(InventoryValidator.onlyId())
    public async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        if (req.body.inventoryRef.closed) {
            throw new Error("Inventário finalizado");
        }

        await new InventoryRepository().delete(id);

        RouteResponse.success({ id }, res);
    }
}
