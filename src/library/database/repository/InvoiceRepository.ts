// Libs
import { Repository } from "typeorm";

// Entities
import { Invoice } from "@library/database/entity";

// Repositories
import { BaseRepository } from "./BaseRepository";

/**
 * InvoiceRepository
 *
 * Repositório para model de notas fiscais
 */
export class InvoiceRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = Invoice;
    }

    /**
     * insert
     *
     * Adiciona uma nova nota fiscal
     *
     * @param invoice - Dados da nota fiscal
     *
     * @returns Nota fiscal adicionada
     */
    public insert(invoice: Partial<Invoice>): Promise<Invoice> {
        // TODO: criar um InvoiceMaterial para cada material
        const repository: Repository<Invoice> = this.getConnection().getRepository(Invoice);
        return repository.save(repository.create(invoice));
    }
}
