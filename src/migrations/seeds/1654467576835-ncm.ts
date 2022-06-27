// Libs
import { MigrationInterface, QueryRunner } from "typeorm";

// Entities
import { NCM } from "../../library/database/entity";

// Common
import { NCM_LIST } from "../../common/NCM_LIST";

export class ncm1654467576835 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await Promise.all(
            NCM_LIST.slice(0, 5015).map(async ({ code, description }) => {
                const duplicate: NCM | undefined = await queryRunner.manager.findOne(NCM, { code });

                if (!duplicate) {
                    const ncm: NCM = queryRunner.manager.create(NCM, { code, description });
                    return queryRunner.manager.save(ncm);
                }

                return Promise.resolve();
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await Promise.all(NCM_LIST.map(({ code }) => queryRunner.manager.delete(NCM, { code })));
    }
}
