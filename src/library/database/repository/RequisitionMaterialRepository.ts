// Libs
import { Repository } from "typeorm";

// Entities
import { RequisitionMaterial } from "@library/database/entity";

// Repositories
import { BaseRepository } from "./BaseRepository";

/**
 * RequisitionMaterialRepository
 *
 * Repositório para model de materiais da requisição
 */
export class RequisitionMaterialRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = RequisitionMaterial;
    }

    /**
     * insert
     *
     * Adiciona um novo material da requisição
     *
     * @param requisitionMaterial - Dados do material da requisição
     *
     * @returns Material da requisição adicionado
     */
    public insert(requisitionMaterial: Partial<RequisitionMaterial>): Promise<RequisitionMaterial> {
        // TODO: criar um RequisitionMaterial gera movimentação
        const repository: Repository<RequisitionMaterial> = this.getConnection().getRepository(RequisitionMaterial);
        return repository.save(repository.create(requisitionMaterial));
    }

    /**
     * update
     *
     * Altera um material da requisição
     *
     * @param requisitionMaterial - Dados do material da requisição
     *
     * @returns Material da requisição alterado
     */
    public update(requisitionMaterial: RequisitionMaterial): Promise<RequisitionMaterial> {
        return this.getConnection().getRepository(RequisitionMaterial).save(requisitionMaterial);
    }
}
