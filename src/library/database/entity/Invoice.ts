// Libs
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// Entities
import { InvoiceMaterial } from "./InvoiceMaterial";
import { Supplier } from "./Supplier";

@Entity()
export class Invoice extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column()
    public number: number;

    @Column()
    public key: string;

    // Relations

    @ManyToOne(() => Supplier, ({ invoices }: Supplier) => invoices, {
        eager: true
    })
    public supplier: Supplier; // FK

    @OneToMany(() => InvoiceMaterial, ({ invoice }: InvoiceMaterial) => invoice)
    public invoiceMaterials: InvoiceMaterial[];

    // Triggers
}
