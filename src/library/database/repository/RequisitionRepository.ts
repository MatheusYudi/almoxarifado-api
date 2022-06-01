// Libs
import { DeleteResult, Repository } from "typeorm";

// Entities
import { Requisition, User } from "@library/database/entity";

// Repositories
import { BaseRepository } from "./BaseRepository";

/**
 * RequisitionRepository
 *
 * Repositório para model de requisições
 */
export class RequisitionRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = Requisition;
    }

    /**
     * insert
     *
     * Adiciona uma nova requisição
     *
     * @param requisition - Dados da requisição
     *
     * @returns Requisição adicionada
     */
    public insert(requisition: Partial<Requisition>): Promise<Requisition> {
        const repository: Repository<Requisition> = this.getConnection().getRepository(Requisition);
        return repository.save(repository.create(requisition));
    }

    /**
     * update
     *
     * Altera uma requisição
     *
     * @param requisition - Dados da requisição
     *
     * @returns Requisição alterada
     */
    public update(requisition: Requisition): Promise<Requisition> {
        return this.getConnection().getRepository(Requisition).save(requisition);
    }

    /**
     * delete
     *
     * Remove uma requisição (não aprovada) pelo ID
     *
     * @param id - ID da requisição
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(Requisition).delete(id);
    }

    /**
     * findByUser
     *
     * Busca uma requisição pelo usuário
     *
     * @param user - Usuário
     *
     * @returns Requisição
     */
    public findByUser(user: User): Promise<Requisition | undefined> {
        return this.getConnection().getRepository(Requisition).findOne({ user });
    }
}
