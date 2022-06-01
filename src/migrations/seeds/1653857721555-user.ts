// Libs
import { MigrationInterface, QueryRunner } from "typeorm";

// Entities
import { AccessGroup, User } from "../../library/database/entity";

export class user1653857721555 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Procura os grupos de acesso
        const admin: AccessGroup | undefined = await queryRunner.manager.findOne(AccessGroup, { name: "Administrador" });
        const supervisor: AccessGroup | undefined = await queryRunner.manager.findOne(AccessGroup, { name: "Supervisor" });

        // Cria conta do admin
        const adminUser: User = queryRunner.manager.create(User, {
            accessGroup: admin,
            name: "Administrador",
            email: "admin@email.com",
            document: "771.995.380-06",
            password: "admin_pass"
        });

        // Cria conta do supervisor
        const supervisorUser: User = queryRunner.manager.create(User, {
            accessGroup: supervisor,
            name: "Supervisor",
            email: "supervisor@email.com",
            document: "470.326.940-63",
            password: "supervisor_pass"
        });

        await queryRunner.manager.save([adminUser, supervisorUser]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(User, { email: "admin@email.com" });
        await queryRunner.manager.delete(User, { email: "supervisor@email.com" });
    }
}
