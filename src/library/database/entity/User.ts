// Libs
import {
    Entity,
    Column,
    BaseEntity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeSoftRemove,
    BeforeUpdate
} from "typeorm";

// Enums
import { EnumStatus } from "@common/enums";

// Utils
import { CryptoUtils } from "@common/utils/CryptoUtils";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column({ unique: true })
    public name: string;

    @Column({ unique: true })
    public document: string;

    @Column({ unique: true })
    public email: string;

    @Column({ select: false })
    public password: string;

    @Column({
        type: "enum",
        enum: EnumStatus,
        default: EnumStatus.ACTIVE
    })
    public status: EnumStatus;

    @Column({
        select: false,
        update: false
    })
    public salt: string;

    // Triggers

    @BeforeInsert()
    @BeforeUpdate()
    public encryptPassword(): void {
        if (this.password) {
            this.salt = CryptoUtils.getRandomString(16);
            this.password = CryptoUtils.sha512(this.password, this.salt);
        }
    }

    @BeforeSoftRemove()
    public setRemoveStatus(): void {
        this.status = EnumStatus.INACTIVE;
    }
}
