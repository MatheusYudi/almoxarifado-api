// Entities
import { NCM } from "@library/database/entity";

// Repositories
import { BaseRepository } from "./BaseRepository";

/**
 * NCMRepository
 *
 * Repositório para model de códigos NCM
 */
export class NCMRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = NCM;
    }

    /**
     * findByCode
     *
     * Busca um NCM pelo código
     *
     * @param code - Código do NCM
     *
     * @returns NCM buscado
     */
    public findByCode(code: string): Promise<NCM | undefined> {
        return this.getConnection().getRepository(NCM).findOne({ code });
    }
}
