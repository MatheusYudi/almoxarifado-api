// Libs
import { DeleteResult, Repository } from "typeorm";

// Entities
import { AccessGroup } from "@library/database/entity";

// Repositories
import { BaseRepository } from "./BaseRepository";

/**
 * AccessGroupRepository
 *
 * Repositório para model de grupos de acesso
 */
export class AccessGroupRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = AccessGroup;
    }

    /**
     * insert
     *
     * Adiciona um novo grupo de acesso
     *
     * @param accessGroup - Dados do grupo de acesso
     *
     * @returns Grupo de acesso adicionado
     */
    public insert(accessGroup: Partial<AccessGroup>): Promise<AccessGroup> {
        const repository: Repository<AccessGroup> = this.getConnection().getRepository(AccessGroup);
        return repository.save(repository.create(accessGroup));
    }

    /**
     * update
     *
     * Altera um grupo de acesso
     *
     * @param accessGroup - Dados do grupo de acesso
     *
     * @returns Grupo de acesso alterado
     */
    public update(accessGroup: AccessGroup): Promise<AccessGroup> {
        return this.getConnection().getRepository(AccessGroup).save(accessGroup);
    }

    /**
     * delete
     *
     * Remove um grupo de acesso pelo ID
     *
     * @param id - ID do grupo de acesso
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(AccessGroup).delete(id);
    }

    /**
     * findByName
     *
     * Busca um grupo de acesso pelo nome
     *
     * @param name - Nome do grupo de acesso
     *
     * @returns Grupo de acesso buscado
     */
    public findByName(name: string): Promise<AccessGroup | undefined> {
        return this.getConnection().getRepository(AccessGroup).findOne({ name });
    }

    /**
     * findByUser
     *
     * Busca um grupo pelo ID do usuário
     *
     * @param userId - ID do usuário
     *
     * @returns Grupo de acesso buscado
     */
    public findByUser(userId: string): Promise<AccessGroup | undefined> {
        return this.getConnection()
            .getRepository(AccessGroup)
            .findOne({
                where: { id: userId }
            });
    }
}
