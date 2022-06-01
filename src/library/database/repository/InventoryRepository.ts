// Libs
import { DeleteResult, Repository } from "typeorm";

// Entities
import { Inventory, User } from "@library/database/entity";

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
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(Inventory).delete(id);
    }

    /**
     * findByUser
     *
     * Busca um inventário pelo usuário
     *
     * @param user - Usuário
     *
     * @returns Inventário
     */
    public findByUser(user: User): Promise<Inventory | undefined> {
        return this.getConnection().getRepository(Inventory).findOne({ user });
    }
}
