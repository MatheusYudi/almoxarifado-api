// Libs
import { Repository } from "typeorm";

// Entities
import { Material, RequisitionMaterial } from "@library/database/entity";

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

    /**
     * findByMaterial
     *
     * Busca um material da requisição pelo material
     *
     * @param material - Material
     *
     * @returns Material da requisição
     */
    public findByMaterial(material: Material): Promise<RequisitionMaterial | undefined> {
        return this.getConnection().getRepository(RequisitionMaterial).findOne({ material });
    }
}
