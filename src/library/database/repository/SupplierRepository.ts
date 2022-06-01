// Libs
import { Repository, UpdateResult } from "typeorm";

// Entities
import { Supplier } from "@library/database/entity";

// Repositories
import { BaseRepository } from "./BaseRepository";

/**
 * SupplierRepository
 *
 * Repositório para model de fornecedores
 */
export class SupplierRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = Supplier;
    }

    /**
     * insert
     *
     * Adiciona um novo fornecedor
     *
     * @param supplier - Dados do fornecedor
     *
     * @returns Fornecedor adicionado
     */
    public insert(supplier: Partial<Supplier>): Promise<Supplier> {
        const repository: Repository<Supplier> = this.getConnection().getRepository(Supplier);
        return repository.save(repository.create(supplier));
    }

    /**
     * update
     *
     * Altera um fornecedor
     *
     * @param supplier - Dados do fornecedor
     *
     * @returns Fornecedor alterado
     */
    public update(supplier: Supplier): Promise<Supplier> {
        return this.getConnection().getRepository(Supplier).save(supplier);
    }

    /**
     * delete
     *
     * Remove um fornecedor pelo ID
     *
     * @param id - ID do fornecedor
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<UpdateResult> {
        return this.getConnection().getRepository(Supplier).softDelete(id);
    }

    /**
     * findDuplicate
     *
     * Busca por um fornecedor com dados duplicados
     *
     * @param value - Dodos duplicado
     *
     * @returns Fornecedor buscado
     */
    public findDuplicate(value: string): Promise<Supplier | undefined> {
        return this.getConnection()
            .getRepository(Supplier)
            .findOne({
                where: [{ document: value }, { stateRegistration: value }, { corporateName: value }, { tradingName: value }],
                withDeleted: true
            });
    }
}
