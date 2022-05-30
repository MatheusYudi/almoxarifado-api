// Libs
import { Repository } from "typeorm";

// Entities
import { InvoiceMaterial } from "@library/database/entity";

// Repositories
import { BaseRepository } from "./BaseRepository";

/**
 * InvoiceMaterialRepository
 *
 * Repositório para model de materiais da nota fiscal
 */
export class InvoiceMaterialRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = InvoiceMaterial;
    }

    /**
     * insert
     *
     * Adiciona um novo material da nota fiscal
     *
     * @param invoiceMaterial - Dados do material da nota fiscal
     *
     * @returns Material da nota fiscal adicionado
     */
    public insert(invoiceMaterial: Partial<InvoiceMaterial>): Promise<InvoiceMaterial> {
        // TODO: criar um InvoiceMaterial gera movimentação
        const repository: Repository<InvoiceMaterial> = this.getConnection().getRepository(InvoiceMaterial);
        return repository.save(repository.create(invoiceMaterial));
    }
}
