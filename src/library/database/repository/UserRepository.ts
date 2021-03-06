// Libs
import { Repository, UpdateResult } from "typeorm";

// Entities
import { AccessGroup, User } from "@library/database/entity";

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
    public async changePassword(userId: number, value: string): Promise<User | undefined> {
        const repository: Repository<User> = this.getConnection().getRepository(User);
        const user: User | undefined = await repository.findOne(userId);

        if (user) {
            user.password = value;

            return this.update(user);
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
    public delete(id: string): Promise<UpdateResult> {
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
     * @param withCredentials - Recuperar somente as credenciais
     * @param withDeleted - Recuperar registros inativos
     *
     * @returns Usuário buscado
     */
    public async findByEmailOrDocument(value: string, withCredentials = false, withDeleted = false): Promise<User | undefined> {
        const user: User | undefined = await this.getConnection()
            .getRepository(User)
            .findOne({
                where: [{ email: value }, { document: value }],
                withDeleted
            });

        if (user && !withCredentials) {
            delete (user as Partial<User>).password;
            delete (user as Partial<User>).salt;
        }

        return user;
    }

    /**
     * findByAccessGroup
     *
     * Busca um usuário pelo grupo de acesso
     *
     * @param accessGroup - Grupo de acesso
     *
     * @returns Usuário
     */
    public findByAccessGroup(accessGroup: AccessGroup): Promise<User | undefined> {
        return this.getConnection().getRepository(User).findOne({ accessGroup });
    }
}
