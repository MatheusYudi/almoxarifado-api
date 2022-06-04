// Libs
import { Request, Response } from "express";

// Library
import { Supplier } from "@library/database/entity";
import { SupplierRepository } from "@library/database/repository";

// Decorators
import { Controller, Delete, Get, Middlewares, Post, Put } from "@decorators/index";

// Enums
import { EnumEndpoints } from "@common/enums";

// Routes
import { RouteResponse } from "@routes/index";

// Middlewares
import { BaseController } from "@middlewares/index";

// Validators
import { SupplierValidator } from "./SupplierValidator";

@Controller(EnumEndpoints.SUPPLIER)
export class SupplierController extends BaseController {
    /**
     * @swagger
     *
     * /supplier:
     *   get:
     *     summary: Lista os fornecedores
     *     tags: [Supplier]
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
        const [rows, count] = await new SupplierRepository().list<Supplier>(SupplierController.listParams(req));

        RouteResponse.success({ rows, count }, res);
    }

    /**
     * @swagger
     *
     * /supplier/{id}:
     *   get:
     *     summary: Retorna informações de um fornecedor
     *     tags: [Supplier]
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
    @Middlewares(SupplierValidator.onlyId())
    public async getOne(req: Request, res: Response): Promise<void> {
        RouteResponse.success({ ...req.body.supplierRef }, res);
    }

    /**
     * @swagger
     *
     * /supplier:
     *   post:
     *     summary: Cria um fornecedor
     *     tags: [Supplier]
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
     *               document: '16.742.119/0001-70'
     *               stateRegistrationType: 'Contribuinte'
     *               stateRegistration: '835.885.752.822'
     *               corporateName: 'Razão social'
     *               tradingName: 'Nome fantasia'
     *               calculationRegime: 'Lucro Real'
     *               state: 'SP'
     *               postalCode: '04116-020'
     *               address: 'Rua Professora Carolina Ribeiro'
     *               addressNumber: 137
     *               city: 'Ribeirão Preto'
     *               district: 'Jardim São José'
     *               complement: 'Apto. 19'
     *             required:
     *               - document
     *               - stateRegistrationType
     *               - stateRegistration
     *               - corporateName
     *               - tradingName
     *               - calculationRegime
     *               - state
     *               - postalCode
     *               - address
     *               - addressNumber
     *               - city
     *               - district
     *             properties:
     *               document:
     *                 type: string
     *               stateRegistrationType:
     *                 description: Tipo da inscrição estadual
     *                 type: string
     *                 enum: ['Contribuinte', 'Não contribuinte', 'Isento']
     *               stateRegistration:
     *                 description: Inscrição estadual
     *                 type: string
     *               corporateName:
     *                 description: Razão social
     *                 type: string
     *               tradingName:
     *                 description: Nome fantasia
     *                 type: string
     *               calculationRegime:
     *                 description: Tipo do regime de apuração
     *                 type: string
     *                 enum: ['Lucro Arbitrado', 'MEI', 'Lucro Presumido', 'Lucro Real', 'Simples Nacional']
     *               state:
     *                 type: string
     *               postalCode:
     *                 type: string
     *               address:
     *                 type: string
     *               addressNumber:
     *                 type: number
     *               city:
     *                 type: string
     *               district:
     *                 type: string
     *               complement:
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
    @Middlewares(SupplierValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const newSupplier: Partial<Supplier> = SupplierController.extractSupplierData(req.body);

        await new SupplierRepository().insert(newSupplier);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     *
     * /supplier:
     *   put:
     *     summary: Altera um fornecedor
     *     tags: [Supplier]
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
     *               document: '16.742.119/0001-70'
     *               stateRegistrationType: 'Contribuinte'
     *               stateRegistration: '835.885.752.822'
     *               corporateName: 'Razão social'
     *               tradingName: 'Nome fantasia'
     *               calculationRegime: 'Lucro Real'
     *               state: 'SP'
     *               postalCode: '04116-020'
     *               address: 'Rua Professora Carolina Ribeiro'
     *               addressNumber: 137
     *               city: 'Ribeirão Preto'
     *               district: 'Jardim São José'
     *               complement: 'Apto. 19'
     *             required:
     *               - id
     *             properties:
     *               id:
     *                 type: number
     *               document:
     *                 type: string
     *               stateRegistrationType:
     *                 description: Tipo da inscrição estadual
     *                 type: string
     *                 enum: ['Contribuinte', 'Não contribuinte', 'Isento']
     *               stateRegistration:
     *                 description: Inscrição estadual
     *                 type: string
     *               corporateName:
     *                 description: Razão social
     *                 type: string
     *               tradingName:
     *                 description: Nome fantasia
     *                 type: string
     *               calculationRegime:
     *                 description: Tipo do regime de apuração
     *                 type: string
     *                 enum: ['Lucro Arbitrado', 'MEI', 'Lucro Presumido', 'Lucro Real', 'Simples Nacional']
     *               state:
     *                 type: string
     *               postalCode:
     *                 type: string
     *               address:
     *                 type: string
     *               addressNumber:
     *                 type: number
     *               city:
     *                 type: string
     *               district:
     *                 type: string
     *               complement:
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
    @Middlewares(SupplierValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const { supplierRef, ...rest } = req.body;

        const supplier: Supplier = {
            ...supplierRef,
            ...SupplierController.extractSupplierData(rest)
        };

        await new SupplierRepository().update(supplier);

        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     *
     * /supplier/{id}:
     *   delete:
     *     summary: Remove um fornecedor
     *     tags: [Supplier]
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
    @Middlewares(SupplierValidator.delete())
    public async remove(req: Request, res: Response): Promise<void> {
        const { supplierRef } = req.body;
        const { id } = req.params;
        const supplierRepository: SupplierRepository = new SupplierRepository();

        // Seta status inativo
        (supplierRef as Supplier).setRemoveStatus();

        await supplierRepository.update(supplierRef);
        await supplierRepository.delete(id);

        RouteResponse.success({ id }, res);
    }

    private static extractSupplierData(body: any): Partial<Supplier> {
        const {
            document,
            stateRegistrationType,
            stateRegistration,
            corporateName,
            tradingName,
            calculationRegime,
            state,
            postalCode,
            address,
            addressNumber,
            city,
            district,
            complement
        } = body;

        return {
            document,
            stateRegistrationType,
            stateRegistration,
            corporateName,
            tradingName,
            calculationRegime,
            state,
            postalCode,
            address,
            addressNumber,
            city,
            district,
            complement
        };
    }
}
