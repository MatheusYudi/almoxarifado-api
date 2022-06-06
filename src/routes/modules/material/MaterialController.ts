// Libs
import { Request, Response } from "express";

// Library
import { Mailer } from "@library/Mailer";
import { Material, NCM } from "@library/database/entity";
import { MaterialRepository, NCMRepository } from "@library/database/repository";

// Decorators
import { Controller, Delete, Get, Middlewares, Post, Put } from "@decorators/index";

// Common
import { AppDef } from "@common/AppDef";

// Enums
import { EnumEndpoints } from "@common/enums";

// Routes
import { RouteResponse } from "@routes/index";

// Middlewares
import { BaseController } from "@middlewares/index";

// Validators
import { MaterialValidator } from "./MaterialValidator";

@Controller(EnumEndpoints.MATERIAL)
export class MaterialController extends BaseController {
    private static extractMaterialData(body: any): Partial<Material> {
        const { materialGroupRef: materialGroup, unit, name, ncm, barcode, unitPrice, stockQuantity, minimumStock } = body;

        return {
            materialGroup,
            unit,
            name,
            ncm,
            barcode,
            unitPrice,
            stockQuantity,
            minimumStock
        };
    }

    /**
     * @swagger
     *
     * /material:
     *   get:
     *     summary: Lista os materiais
     *     tags: [Material]
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
     *       - $ref: '#/components/parameters/listStatusRef'
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
        const [rows, count] = await new MaterialRepository().list<Material>(MaterialController.listParams(req));

        RouteResponse.success({ rows, count }, res);
    }

    /**
     * @swagger
     *
     * /material/{id}:
     *   get:
     *     summary: Retorna informações de um material
     *     tags: [Material]
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
    @Middlewares(MaterialValidator.onlyId())
    public async getOne(req: Request, res: Response): Promise<void> {
        RouteResponse.success({ ...req.body.materialRef }, res);
    }

    /**
     * @swagger
     *
     * /material:
     *   post:
     *     summary: Cria um material
     *     tags: [Material]
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
     *               materialGroupId: 1
     *               unit: 'kg'
     *               name: 'materialName'
     *               ncmId: 1
     *               barcode: '01234567890'
     *               unitPrice: 1.99
     *               stockQuantity: 99
     *               minimumStock: 9
     *             required:
     *               - materialGroupId
     *               - unit
     *               - name
     *               - ncm
     *               - barcode
     *               - unitPrice
     *               - stockQuantity
     *               - minimumStock
     *             properties:
     *               materialGroupId:
     *                 type: number
     *               unit:
     *                 type: string
     *               name:
     *                 type: string
     *               ncmId:
     *                 type: number
     *               barcode:
     *                 type: string
     *               unitPrice:
     *                 type: number
     *               stockQuantity:
     *                 type: number
     *               minimumStock:
     *                 type: number
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
    @Middlewares(MaterialValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const newMaterial: Partial<Material> = MaterialController.extractMaterialData(req.body);

        await new MaterialRepository().insert(newMaterial);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     *
     * /material:
     *   put:
     *     summary: Altera um material
     *     tags: [Material]
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
     *               materialGroupId: 1
     *               unit: 'kg'
     *               name: 'materialName'
     *               ncmId: 1
     *               barcode: '01234567890'
     *               unitPrice: 1.99
     *               stockQuantity: 99
     *               minimumStock: 9
     *             required:
     *               - id
     *             properties:
     *               id:
     *                 type: number
     *               materialGroupId:
     *                 type: number
     *               unit:
     *                 type: string
     *               name:
     *                 type: string
     *               ncmId:
     *                 type: number
     *               barcode:
     *                 type: string
     *               unitPrice:
     *                 type: number
     *               stockQuantity:
     *                 type: number
     *               minimumStock:
     *                 type: number
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
    @Middlewares(MaterialValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const { materialRef, ...rest } = req.body;

        const material: Material = {
            ...materialRef,
            ...MaterialController.extractMaterialData(rest)
        };

        await new MaterialRepository().update(material);

        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     *
     * /material/{id}:
     *   delete:
     *     summary: Remove um material
     *     tags: [Material]
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
    @Middlewares(MaterialValidator.delete())
    public async remove(req: Request, res: Response): Promise<void> {
        const { materialRef } = req.body;
        const { id } = req.params;
        const materialRepository: MaterialRepository = new MaterialRepository();

        // Seta status inativo
        (materialRef as Material).setRemoveStatus();

        await materialRepository.update(materialRef);
        await materialRepository.delete(id);

        RouteResponse.success({ id }, res);
    }

    /**
     * @swagger
     *
     * /material/purchase-request:
     *   post:
     *     summary: Dispara email de solicitação de compra
     *     tags: [Material]
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
     *               email: purchase_email@email.com
     *             required:
     *               - email
     *             properties:
     *               email:
     *                 type: string
     *                 description: Email a ser enviada a solicitação
     *     responses:
     *       200:
     *         $ref: '#/components/responses/200'
     *       400:
     *         $ref: '#/components/responses/400'
     *       500:
     *         $ref: '#/components/responses/500'
     */
    @Post("/purchase-request")
    @Middlewares(MaterialValidator.requestPurchase())
    public async requestPurchase(req: Request, res: Response): Promise<void> {
        const { userRef, email } = req.body;
        const materials: Material[] = await new MaterialRepository().findOutOfStock();

        // para cada material cria uma linha da tabela de solicitação
        const tableHeader = `
            <tr>
                <th>Nome</th>
                <th>NCM</th>
                <th>Quantidade</th>
            </tr>
        `;
        const tableRows: string[] = [tableHeader].concat(
            ...materials.map(({ name, ncm, minimumStock, stockQuantity }) => {
                return `
                <tr>
                    <td>${name}</td>
                    <td>${ncm}</td>
                    <td>${minimumStock - stockQuantity}</td>
                </tr>
            `;
            })
        );

        new Mailer().sendPurchaseRequestEmail({ email: userRef.email, name: userRef.name }, { email }, tableRows).catch((error: Error) => {
            new AppDef().logger.warning("purchase_request_email", error.message);
        });

        RouteResponse.success("Solicitação de compra enviada com sucesso.", res);
    }

    /**
     * @swagger
     *
     * /material/code/ncm:
     *   get:
     *     summary: Lista os códigos NCM
     *     tags: [Material]
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
    @Get("/code/ncm")
    public async getNCM(req: Request, res: Response): Promise<void> {
        const [rows, count] = await new NCMRepository().list<NCM>(MaterialController.listParams(req));

        RouteResponse.success({ rows, count }, res);
    }
}
