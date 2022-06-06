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
}
