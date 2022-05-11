// Libs
import { DeepPartial, DeleteResult, Repository } from "typeorm";

// Entities
import { User } from "@library/database/entity";

// Repositories
import { BaseRepository } from "@library/database/repository";

/**
 * UserRepository
 *
 * Repositório para model de usuários
 */
export class UserRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = User;
    }

    /**
     * insert
     *
     * Adiciona um novo usuário
     *
     * @param user - Dados do usuário
     *
     * @returns Usuário adicionado
     */
    public insert(user: DeepPartial<User>): Promise<User> {
        const userRepository: Repository<User> = this.getConnection().getRepository(User);
        return userRepository.save(userRepository.create(user));
    }

    /**
     * insert
     *
     * Altera um usuário
     *
     * @param user - Dados do usuário
     *
     * @returns Usuário alterado
     */
    public update(user: User): Promise<User> {
        return this.getConnection().getRepository(User).save(user);
    }

    /**
     * delete
     *
     * Remove um usuário pelo ID
     *
     * @param id - ID do usuário
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(User).delete(id);
    }

    /**
     * findByName
     *
     * Busca um usuário pelo nome
     *
     * @param name - Nome do usuário
     *
     * @returns Usuário buscado
     */
    public findByName(name: string): Promise<User | undefined> {
        return this.getConnection().getRepository(User).findOne({ name });
    }
}
