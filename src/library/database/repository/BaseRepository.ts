// Libs
import { BaseEntity, Connection, FindConditions, FindManyOptions, getConnection, ObjectID } from "typeorm";

// Enums
import { EnumConstants } from "@common/enums";

// Interfaces
import { IGetListParams } from "@common/interfaces";

/**
 * BaseRepository
 *
 * Classe que todo repositório estende
 */
export class BaseRepository {
    private connection: Connection;

    protected entity: typeof BaseEntity;

    /**
     * getConnection
     *
     * Retorna singleton de conexão com o banco
     *
     * @returns Instância de conexão
     */
    protected getConnection(): Connection {
        if (!this.connection) {
            this.connection = getConnection(EnumConstants.CONNECTION_NAME);
        }

        return this.connection;
    }

    /**
     * list
     *
     * Retorna lista de itens
     *
     * @param params - Parâmetros de busca
     *
     * @returns Lista contendo os itens e a quantidade total de itens
     */
    public list<Entity>(params: IGetListParams): Promise<[Entity[], number]> {
        const { order, orderBy, page, size, status } = params;

        const skip: number = (page - 1) * size;
        const options: FindManyOptions<Entity> = {
            take: size,
            skip,
            withDeleted: true
        };

        if (order) {
            (options.order as Record<string, IGetListParams["orderBy"]>) = { [order]: orderBy };
        }

        if (status) {
            options.where = { status };
        }

        return this.getConnection().getRepository<Entity>(this.entity).findAndCount(options);
    }

    /**
     * findOne
     *
     * Busca um item pelo ID
     *
     * @param id - ID do item
     *
     * @returns Item buscado
     */
    public findOne<Entity>(id: string | number | ObjectID | Date): Promise<Entity | undefined> {
        return this.getConnection().getRepository<Entity>(this.entity).findOne(id);
    }

    /**
     * find
     *
     * Busca todos os itens que atenderem a condição
     *
     * @param options - Condições de busca
     *
     * @returns Lista de itens
     */
    public find<Entity>(options?: FindConditions<Entity> | undefined): Promise<Entity[]> {
        return this.getConnection().getRepository<Entity>(this.entity).find(options);
    }

    /**
     * count
     *
     * Retorna a quantidade de registros que atendem as opções
     *
     * @param options - Opções de busca
     *
     * @returns Quantidade total
     */
    public count<Entity>(options?: FindManyOptions<Entity> | undefined): Promise<number> {
        return this.getConnection().getRepository<Entity>(this.entity).count(options);
    }
}
