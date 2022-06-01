// Libs
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

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

    @Column({ default: false })
    public approved: boolean;

    // Relations

    @ManyToOne(() => User, ({ requisitions }: User) => requisitions, {
        eager: true
    })
    public user: User; // FK

    @OneToMany(() => RequisitionMaterial, ({ requisition }: RequisitionMaterial) => requisition, {
        eager: true,
        cascade: true,
        nullable: false
    })
    public requisitionMaterials: RequisitionMaterial[];

    // Triggers
}
