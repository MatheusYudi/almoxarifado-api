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
import { InventoryMaterial } from "./InventoryMaterial";
import { InvoiceMaterial } from "./InvoiceMaterial";
import { MaterialGroup } from "./MaterialGroup";
import { Movement } from "./Movement";
import { NCM } from "./NCM";
import { RequisitionMaterial } from "./RequisitionMaterial";

@Entity()
export class Material extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @DeleteDateColumn()
    public deletedAt: Date;

    @Column()
    public unit: string;

    @Column({ unique: true })
    public name: string;

    @Column({ unique: true })
    public barcode: string;

    @Column({ type: "float" })
    public unitPrice: number;

    @Column({ type: "float" })
    public stockQuantity: number;

    @Column({ type: "float" })
    public minimumStock: number;

    @Column()
    public status: EnumStatuses = EnumStatuses.ACTIVE;

    // Relations

    @ManyToOne(() => NCM, ({ materials }: NCM) => materials, {
        eager: true
    })
    public ncm: NCM; // FK

    @ManyToOne(() => MaterialGroup, ({ materials }: MaterialGroup) => materials, {
        eager: true
    })
    public materialGroup: MaterialGroup; // FK

    @OneToMany(() => Movement, ({ user }: Movement) => user)
    public movements: Movement[];

    @OneToMany(() => InvoiceMaterial, ({ material }: InvoiceMaterial) => material)
    public invoiceMaterials: InvoiceMaterial[];

    @OneToMany(() => InventoryMaterial, ({ material }: InventoryMaterial) => material)
    public inventoryMaterials: InventoryMaterial[];

    @OneToMany(() => RequisitionMaterial, ({ material }: RequisitionMaterial) => material)
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
