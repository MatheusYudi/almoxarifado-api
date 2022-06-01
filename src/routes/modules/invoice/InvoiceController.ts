// Libs
import { Request, Response } from "express";

// Library
import { Invoice, InvoiceMaterial, Movement } from "@library/database/entity";
import { InvoiceRepository, MovementRepository } from "@library/database/repository";

// Decorators
import { Controller, Get, Middlewares, Post } from "@decorators/index";

// Enums
import { EnumEndpoints, EnumMovementTypes } from "@common/enums";

// Routes
import { RouteResponse } from "@routes/index";

// Middlewares
import { BaseController } from "@middlewares/index";

// Validators
import { InvoiceValidator } from "./InvoiceValidator";

interface IInvoiceItem {
    materialId: InvoiceMaterial["material"]["id"];
    materialRef: InvoiceMaterial["material"];
    quantity: InvoiceMaterial["quantity"];
}

@Controller(EnumEndpoints.INVOICE)
export class InvoiceController extends BaseController {
    /**
     * @swagger
     *
     * /invoice:
     *   get:
     *     summary: Lista as notas fiscais
     *     tags: [Invoice]
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
        const [rows, count] = await new InvoiceRepository().list<Invoice>(InvoiceController.listParams(req));

        RouteResponse.success({ rows, count }, res);
    }

    /**
     * @swagger
     *
     * /invoice:
     *   post:
     *     summary: Cria uma nota fiscal
     *     tags: [Invoice]
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
     *               supplierId: 1
     *               number: 12345
     *               key: 'invoice_key'
     *               items: [{ materialId: 1, quantity: 9 }]
     *             required:
     *               - supplierId
     *               - number
     *               - key
     *               - items
     *             properties:
     *               supplierId:
     *                 type: number
     *               number:
     *                 type: number
     *               key:
     *                 type: string
     *               items:
     *                 description: Itens da nota fiscal
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
    @Middlewares(InvoiceValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const { userRef, supplierRef, number, key, items } = req.body;

        const materials: InvoiceMaterial[] = (items as IInvoiceItem[]).map(item => {
            const invoiceMaterial: InvoiceMaterial = new InvoiceMaterial();

            invoiceMaterial.material = item.materialRef;
            invoiceMaterial.quantity = item.quantity;

            return invoiceMaterial;
        });

        const newInvoice: Partial<Invoice> = {
            supplier: supplierRef,
            number,
            key,
            invoiceMaterials: materials
        };

        const invoice: Invoice = await new InvoiceRepository().insert(newInvoice);

        // para cada InvoiceMaterial gera uma movimentação
        await Promise.all(
            invoice.invoiceMaterials.map(async ({ material, quantity }: InvoiceMaterial) => {
                const newMovement: Partial<Movement> = {
                    user: userRef,
                    material,
                    quantity,
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
     * /invoice/{id}:
     *   get:
     *     summary: Retorna informações de uma nota fiscal
     *     tags: [Invoice]
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
    @Middlewares(InvoiceValidator.onlyId())
    public async getOne(req: Request, res: Response): Promise<void> {
        RouteResponse.success({ ...req.body.invoiceRef }, res);
    }
}
