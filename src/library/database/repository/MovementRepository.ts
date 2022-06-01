// Libs
import { Repository } from "typeorm";

// Entities
import { Material, Movement, User } from "@library/database/entity";

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

    /**
     * findByUser
     *
     * Busca uma movimentação pelo usuário
     *
     * @param user - Usuário
     *
     * @returns Movimentação
     */
    public findByUser(user: User): Promise<Movement | undefined> {
        return this.getConnection().getRepository(Movement).findOne({ user });
    }

    /**
     * findByMaterial
     *
     * Busca uma movimentação pelo material
     *
     * @param material - Material
     *
     * @returns Movimentação
     */
    public findByMaterial(material: Material): Promise<Movement | undefined> {
        return this.getConnection().getRepository(Movement).findOne({ material });
    }
}
