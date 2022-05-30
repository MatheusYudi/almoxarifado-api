// Libs
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// Enums
import { EnumMovementTypes } from "@common/enums";

// Entities
import { InventoryMaterial } from "./InventoryMaterial";
import { InvoiceMaterial } from "./InvoiceMaterial";
import { Material } from "./Material";
import { RequisitionMaterial } from "./RequisitionMaterial";
import { User } from "./User";

@Entity()
export class Movement extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column()
    public quantity: number;

    @Column()
    public type: EnumMovementTypes;

    // Relations

    @ManyToOne(() => User, ({ movements }: User) => movements, {
        eager: true
    })
    public user: User;

    @ManyToOne(() => Material, ({ movements }: Material) => movements, {
        eager: true
    })
    public material: Material;

    @OneToOne(() => InvoiceMaterial, ({ movement }: InvoiceMaterial) => movement, {
        nullable: true
    })
    public invoiceMaterial: InvoiceMaterial;

    @OneToOne(() => InventoryMaterial, ({ movement }: InventoryMaterial) => movement, {
        nullable: true
    })
    public inventoryMaterial: InventoryMaterial;

    @OneToOne(() => RequisitionMaterial, ({ movement }: RequisitionMaterial) => movement, {
        nullable: true
    })
    public requisitionMaterial: RequisitionMaterial;

    // Triggers
}
