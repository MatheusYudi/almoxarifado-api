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
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

// Enums
import { EnumStatuses } from "@common/enums";

// Utils
import { CryptoUtils } from "@common/utils";

// Entities
import { AccessGroup } from "./AccessGroup";
import { Inventory } from "./Inventory";
import { Movement } from "./Movement";
import { Requisition } from "./Requisition";

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
    public document: string; // CPF

    @Column({ unique: true })
    public email: string;

    @Column()
    public password: string;

    @Column({ update: false })
    public salt: string;

    @Column()
    public status: EnumStatuses = EnumStatuses.ACTIVE;

    // Relations

    @ManyToOne(() => AccessGroup, ({ users }: AccessGroup) => users, {
        eager: true
    })
    public accessGroup: AccessGroup; // FK

    @OneToMany(() => Inventory, ({ user }: Inventory) => user, {
        nullable: true
    })
    public inventories: Inventory[];

    @OneToMany(() => Movement, ({ user }: Movement) => user, {
        nullable: true
    })
    public movements: Movement[];

    @OneToMany(() => Requisition, ({ user }: Requisition) => user, {
        nullable: true
    })
    public requisitions: Requisition[];

    // Triggers

    @BeforeInsert()
    @BeforeUpdate()
    public encryptPassword(): void {
        if (this.password) {
            this.salt = CryptoUtils.getRandomString(16);
            this.password = CryptoUtils.sha512(this.password, this.salt);
        }
    }

    @BeforeUpdate()
    public updateStatus(): void {
        if (this.deletedAt) {
            this.status = EnumStatuses.INACTIVE;
        }
    }

    @BeforeSoftRemove()
    public setRemoveStatus(): void {
        this.status = EnumStatuses.INACTIVE;
    }
}
