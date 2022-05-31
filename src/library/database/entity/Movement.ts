// Libs
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// Enums
import { EnumMovementTypes } from "@common/enums";

// Entities
import { InventoryMaterial } from "./InventoryMaterial";
import { InvoiceMaterial } from "./InvoiceMaterial";
import { Material } from "./Material";
import { RequisitionMaterial } from "./RequisitionMaterial";
import { User } from "./User";

// Repositories
import { MaterialRepository } from "../repository";

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
    public user: User; // FK

    @ManyToOne(() => Material, ({ movements }: Material) => movements, {
        eager: true
    })
    public material: Material; // FK

    @OneToOne(() => InvoiceMaterial, ({ movement }: InvoiceMaterial) => movement)
    public invoiceMaterial: InvoiceMaterial;

    @OneToOne(() => InventoryMaterial, ({ movement }: InventoryMaterial) => movement)
    public inventoryMaterial: InventoryMaterial;

    @OneToOne(() => RequisitionMaterial, ({ movement }: RequisitionMaterial) => movement)
    public requisitionMaterial: RequisitionMaterial;

    // Triggers

    @BeforeInsert()
    public async updateMaterialStock(): Promise<void> {
        if (this.type === EnumMovementTypes.IN) {
            this.material.stockQuantity += this.quantity;
        } else {
            this.material.stockQuantity -= this.quantity;
        }

        await new MaterialRepository().update(this.material);
    }
}
