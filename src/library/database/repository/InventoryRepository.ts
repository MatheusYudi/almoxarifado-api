// Libs
import { Repository, UpdateResult } from "typeorm";

// Entities
import { Inventory } from "@library/database/entity";

// Repositories
import { BaseRepository } from "./BaseRepository";

/**
 * InventoryRepository
 *
 * Repositório para model de inventários
 */
export class InventoryRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = Inventory;
    }

    /**
     * insert
     *
     * Adiciona um novo inventário
     *
     * @param inventory - Dados do inventário
     *
     * @returns Inventário adicionado
     */
    public insert(inventory: Partial<Inventory>): Promise<Inventory> {
        // TODO: criar um InventoryMaterial para cada material
        const repository: Repository<Inventory> = this.getConnection().getRepository(Inventory);
        return repository.save(repository.create(inventory));
    }

    /**
     * update
     *
     * Altera um inventário
     *
     * @param inventory - Dados do inventário
     *
     * @returns Inventário alterado
     */
    public update(inventory: Inventory): Promise<Inventory> {
        // TODO: alterar o InventoryMaterial para cada material
        return this.getConnection().getRepository(Inventory).save(inventory);
    }

    /**
     * delete
     *
     * Remove um inventário (não finalizado) pelo ID
     *
     * @param id - ID do inventário
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<UpdateResult> {
        // TODO: validar se não está finalizado
        // TODO: validar necessidade de apagar os itens
        return this.getConnection().getRepository(Inventory).softDelete(id);
    }

    // TODO: finalizar inventário gera movimentação para cada material
}
