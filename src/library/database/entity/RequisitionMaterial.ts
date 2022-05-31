// Libs
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// Entities
import { Material } from "./Material";
import { Movement } from "./Movement";
import { Requisition } from "./Requisition";

@Entity()
export class RequisitionMaterial extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column()
    public quantity: number;

    // Relations

    @ManyToOne(() => Requisition, ({ requisitionMaterials }: Requisition) => requisitionMaterials, {
        eager: true,
        onDelete: "CASCADE"
    })
    public requisition: Requisition; // FK

    @ManyToOne(() => Material, ({ requisitionMaterials }: Material) => requisitionMaterials, {
        eager: true
    })
    public material: Material; // FK

    @OneToOne(() => Movement, ({ requisitionMaterial }: Movement) => requisitionMaterial)
    @JoinColumn()
    public movement: Movement; // FK

    // Triggers
}
