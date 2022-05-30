// Libs
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// Invoice
import { Invoice } from "./Invoice";
import { Material } from "./Material";
import { Movement } from "./Movement";

@Entity()
export class InvoiceMaterial extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column()
    public quantity: number;

    // Relations

    @ManyToOne(() => Invoice, ({ invoiceMaterials }: Invoice) => invoiceMaterials, {
        eager: true
    })
    public invoice: Invoice; // FK

    @ManyToOne(() => Material, ({ invoiceMaterials }: Material) => invoiceMaterials, {
        eager: true
    })
    public material: Material; // FK

    @OneToOne(() => Movement, ({ invoiceMaterial }: Movement) => invoiceMaterial)
    @JoinColumn()
    public movement: Movement; // FK

    // Triggers
}
