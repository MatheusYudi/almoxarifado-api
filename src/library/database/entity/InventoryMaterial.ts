// Libs
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// Entities
import { Inventory } from "./Inventory";
import { Material } from "./Material";
import { Movement } from "./Movement";

@Entity()
export class InventoryMaterial extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column()
    public systemQuantity: number;

    @Column()
    public physicQuantity: number;

    // Relations

    @ManyToOne(() => Inventory, ({ inventoryMaterials }: Inventory) => inventoryMaterials, {
        eager: true
    })
    public inventory: Inventory; // FK

    @ManyToOne(() => Material, ({ inventoryMaterials }: Material) => inventoryMaterials, {
        eager: true
    })
    public material: Material; // FK

    @OneToOne(() => Movement, ({ inventoryMaterial }: Movement) => inventoryMaterial)
    @JoinColumn()
    public movement: Movement; // FK

    // Triggers
}
