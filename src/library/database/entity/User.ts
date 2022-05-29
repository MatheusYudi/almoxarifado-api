// Libs
import {
    BaseEntity,
    BeforeInsert,
    BeforeSoftRemove,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

// Enums
import { EnumStatus } from "@common/enums";

// Utils
import { CryptoUtils } from "@common/utils";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @DeleteDateColumn()
    public deletedAt: Date;

    @Column({ unique: true })
    public name: string;

    @Column({ unique: true })
    public document: string;

    @Column({ unique: true })
    public email: string;

    @Column()
    public password: string;

    @Column({
        type: "enum",
        enum: EnumStatus,
        default: EnumStatus.ACTIVE
    })
    public status: EnumStatus;

    @Column({ update: false })
    public salt: string;

    // Triggers

    @BeforeInsert()
    public encryptPassword(): void {
        if (this.password) {
            this.salt = CryptoUtils.getRandomString(16);
            this.password = CryptoUtils.sha512(this.password, this.salt);
        }
    }

    @BeforeUpdate()
    public updatePassword(): void {
        if (this.password) {
            this.password = CryptoUtils.sha512(this.password, this.salt);
        }
    }

    @BeforeSoftRemove()
    public setRemoveStatus(): void {
        this.status = EnumStatus.INACTIVE;
    }
}
