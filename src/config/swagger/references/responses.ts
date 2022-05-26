/**
 * @swagger
 * components:
 *   responses:
 *     '200':
 *       description: 'Requisição executada com sucesso'
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *               date:
 *                 type: string
 *                 format: date-time
 *               data:
 *                 type: object
 *                 description: 'Objeto json de retorno'
 *     '201':
 *       description: 'Criado com sucesso'
 *     '204':
 *       description: 'Requisição completa, resposta sem conteúdo'
 *     '400':
 *       description: 'Erro na requisição'
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 example: false
 *               date:
 *                 type: string
 *                 format: date-time
 *               error:
 *                 type: object
 *                 description: 'Objeto ou string com informações sobre o erro'
 *     '401':
 *       description: 'Autenticação não autorizada'
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 example: false
 *               date:
 *                 type: string
 *                 format: date-time
 *               error:
 *                 type: object
 *                 description: 'Acesso não autorizado'
 *     '404':
 *       description: 'Não encontrado'
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 example: false
 *               date:
 *                 type: string
 *                 format: date-time
 *               error:
 *                 type: object
 *                 description: 'Conteúdo não encontrado'
 *     '500':
 *       description: 'Erro interno no servidor'
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 example: false
 *               date:
 *                 type: string
 *                 format: date-time
 *               error:
 *                 type: string
 *                 description: 'Mensagem de erro'
 *     baseResponse:
 *       '200':
 *         $ref: '#/components/responses/200'
 *       '400':
 *         $ref: '#/components/responses/400'
 *       '401':
 *         $ref: '#/components/responses/401'
 *       '500':
 *         $ref: '#/components/responses/500'
 *     baseCreate:
 *       '201':
 *         $ref: '#/components/responses/201'
 *       '400':
 *         $ref: '#/components/responses/400'
 *       '401':
 *         $ref: '#/components/responses/401'
 *       '500':
 *         $ref: '#/components/responses/500'
 *     baseEmpty:
 *       '204':
 *         $ref: '#/components/responses/204'
 *       '400':
 *         $ref: '#/components/responses/400'
 *       '401':
 *         $ref: '#/components/responses/401'
 *       '500':
 *         $ref: '#/components/responses/500'
 */
