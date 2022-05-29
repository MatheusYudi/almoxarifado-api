// Libs
import { MigrationInterface, QueryRunner } from "typeorm";

// Entities
import { AccessGroup } from "../../library/database/entity";

export const accessGroups: string[] = ["Funcionário", "Requisitante", "Supervisor"];

export class accessGroup1653857185362 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await Promise.all(
            accessGroups.map((name: string) => {
                const accessGroup: AccessGroup = queryRunner.manager.create(AccessGroup, { name });
                return queryRunner.manager.save(accessGroup);
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await Promise.all(accessGroups.map((name: string) => queryRunner.manager.delete(AccessGroup, { name })));
    }
}
