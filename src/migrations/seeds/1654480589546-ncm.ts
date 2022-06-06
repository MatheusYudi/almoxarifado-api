// Libs
import { MigrationInterface, QueryRunner } from "typeorm";

// Entities
import { NCM } from "../../library/database/entity";

// Common
import { NCM_LIST } from "../../common/NCM_LIST";

export class ncm1654480589546 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await Promise.all(
            NCM_LIST.slice(5015, 10030).map(({ code, description }) => {
                const accessGroup: NCM = queryRunner.manager.create(NCM, { code, description });
                return queryRunner.manager.save(accessGroup);
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await Promise.all(NCM_LIST.map(({ code }) => queryRunner.manager.delete(NCM, { code })));
    }
}
