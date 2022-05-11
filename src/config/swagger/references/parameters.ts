/**
 * @swagger
 * components:
 *   parameters:
 *     listPageRef:
 *       in: query
 *       name: page
 *       description: Número da pagina
 *       schema:
 *         type: integer
 *         default: 1
 *     listSizeRef:
 *       in: query
 *       name: size
 *       description: Quantidade de itens
 *       schema:
 *         type: integer
 *         default: 10
 *     listOrderRef:
 *       in: query
 *       name: order
 *       description: Chave para ordenar
 *       schema:
 *         type: integer
 *     listOrderByRef:
 *       in: query
 *       name: orderBy
 *       description: Direção da ordenação (ASC)endente (DESC)endente
 *       schema:
 *         type: string
 *         enum: ['ASC', 'DESC']
 *         default: 'ASC'
 */
