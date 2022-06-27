// Libs
import { Repository, UpdateResult } from "typeorm";

// Entities
import { MaterialGroup } from "@library/database/entity";

// Repositories
import { BaseRepository } from "./BaseRepository";

/**
 * MaterialGroupRepository
 *
 * Repositório para model de grupos de materiais
 */
export class MaterialGroupRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = MaterialGroup;
    }

    /**
     * insert
     *
     * Adiciona um novo grupo de material
     *
     * @param materialGroup - Dados do grupo de material
     *
     * @returns Grupo de material adicionado
     */
    public insert(materialGroup: Partial<MaterialGroup>): Promise<MaterialGroup> {
        const repository: Repository<MaterialGroup> = this.getConnection().getRepository(MaterialGroup);
        return repository.save(repository.create(materialGroup));
    }

    /**
     * update
     *
     * Altera um grupo de material
     *
     * @param materialGroup - Dados do grupo de material
     *
     * @returns Grupo de material alterado
     */
    public update(materialGroup: MaterialGroup): Promise<MaterialGroup> {
        return this.getConnection().getRepository(MaterialGroup).save(materialGroup);
    }

    /**
     * delete
     *
     * Remove um grupo de material pelo ID
     *
     * @param id - ID do grupo de material
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<UpdateResult> {
        return this.getConnection().getRepository(MaterialGroup).softDelete(id);
    }

    /**
     * findByName
     *
     * Busca um grupo de material pelo nome
     *
     * @param name - Nome do grupo de material
     *
     * @returns Grupo de material buscado
     */
    public findByName(name: string): Promise<MaterialGroup | undefined> {
        return this.getConnection().getRepository(MaterialGroup).findOne({ name }, { withDeleted: true });
    }
}
