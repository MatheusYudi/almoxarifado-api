// Libs
import { DeleteResult, Repository } from "typeorm";

// Entities
import { User } from "@library/database/entity";

// Repositories
import { BaseRepository } from "./BaseRepository";

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
    public insert(user: Partial<User>): Promise<User> {
        const repository: Repository<User> = this.getConnection().getRepository(User);
        return repository.save(repository.create(user));
    }

    /**
     * update
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
     * changePassword
     *
     * Altera a senha de um usuário
     *
     * @param userId - ID do usuário
     * @param value - Nova senha
     *
     * @returns Usuário alterado
     */
    public async changePassword(userId: string, value: string): Promise<User | undefined> {
        const repository: Repository<User> = this.getConnection().getRepository(User);
        const user: User | undefined = await repository.findOne(userId);

        if (user) {
            return repository.save({ ...user, password: value });
        }

        return undefined;
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
    public async delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(User).softDelete(id);
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
        return this.getConnection().getRepository(User).findOne({ name }, { withDeleted: true });
    }

    /**
     * findByEmailOrDocument
     *
     * Busca um usuário pelo email ou documento
     *
     * @param value - Email ou documento do usuário
     *
     * @returns Usuário buscado
     */
    public findByEmailOrDocument(value: string): Promise<User | undefined> {
        return this.getConnection()
            .getRepository(User)
            .findOne({
                where: [{ email: value }, { document: value }],
                withDeleted: true
            });
    }
}
