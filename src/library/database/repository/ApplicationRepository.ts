// Entities
import { Application } from "@library/database/entity";

// Repositories
import { BaseRepository } from "@library/database/repository";

/**
 * ApplicationRepository
 *
 * Repositório para model de aplicações
 */
export class ApplicationRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = Application;
    }

    /**
     * findCredential
     *
     * Busca as credenciais da aplicação
     *
     * @param id - ID da aplicação
     * @param key - Chave da aplicação
     *
     * @returns Aplicação buscada
     */
    public async findCredential(id: string, key: string): Promise<Application | undefined> {
        const application: Application | undefined = await this.getConnection().getRepository(Application).findOne(id);
        return application?.key === key ? application : undefined;
    }
}
