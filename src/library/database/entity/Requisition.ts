// Libs
import {
    BaseEntity,
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

// Entities
import { RequisitionMaterial } from "./RequisitionMaterial";
import { User } from "./User";

@Entity()
export class Requisition extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @DeleteDateColumn()
    public deletedAt: Date;

    @Column({
        type: "boolean",
        default: false
    })
    public approved: boolean;

    @Column()
    public status: EnumStatuses = EnumStatuses.ACTIVE;

    // Relations

    @ManyToOne(() => User, ({ requisitions }: User) => requisitions, {
        eager: true
    })
    public user: User; // FK

    @OneToMany(() => RequisitionMaterial, ({ requisition }: RequisitionMaterial) => requisition, {
        cascade: true,
        nullable: false
    })
    public requisitionMaterials: RequisitionMaterial[];

    // Triggers

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
