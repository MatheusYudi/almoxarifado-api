// Libs
import { Repository } from "typeorm";

// Entities
import { Movement } from "@library/database/entity";

// Repositories
import { BaseRepository } from "./BaseRepository";

/**
 * MovementRepository
 *
 * Repositório para model de movimentações
 */
export class MovementRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = Movement;
    }

    /**
     * insert
     *
     * Adiciona uma nova movimentação
     *
     * @param movement - Dados da movimentação
     *
     * @returns Movimentação adicionada
     */
    public insert(movement: Partial<Movement>): Promise<Movement> {
        const repository: Repository<Movement> = this.getConnection().getRepository(Movement);
        return repository.save(repository.create(movement));
    }
}
