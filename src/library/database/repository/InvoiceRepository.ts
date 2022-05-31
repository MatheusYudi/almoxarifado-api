// Libs
import { Repository } from "typeorm";

// Entities
import { Invoice, Supplier } from "@library/database/entity";

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

    /**
     * findByKey
     *
     * Busca uma nota fiscal pela chave
     *
     * @param key - Chave da nota fiscal
     *
     * @returns Nota fiscal
     */
    public findByKey(key: string): Promise<Invoice | undefined> {
        return this.getConnection().getRepository(Invoice).findOne({ key });
    }

    /**
     * findBySupplier
     *
     * Busca uma nota fiscal pelo fornecedor
     *
     * @param supplier - Fornecedor
     *
     * @returns Nota fiscal
     */
    public findBySupplier(supplier: Supplier): Promise<Invoice | undefined> {
        return this.getConnection().getRepository(Invoice).findOne({ supplier });
    }
}
