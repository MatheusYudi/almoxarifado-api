// Libs
import { MigrationInterface, QueryRunner } from "typeorm";

// Entities
import { User } from "../../library/database/entity";

export class user1653835332784 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // TODO: add group link

        // Create admin account
        const adminUser: User = queryRunner.manager.create(User, {
            name: "Administrador",
            email: "admin@email.com",
            document: "771.995.380-06",
            password: "admin123"
        });

        const supervisorUser: User = queryRunner.manager.create(User, {
            name: "Supervisor",
            email: "supervisor@email.com",
            document: "470.326.940-63",
            password: "supervisor123"
        });

        await queryRunner.manager.save([adminUser, supervisorUser]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(User, { email: "admin@email.com" });
        await queryRunner.manager.delete(User, { email: "supervisor@email.com" });
    }
}
