// Libs
import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    DeleteDateColumn,
    ManyToOne,
    BeforeSoftRemove,
    BeforeUpdate,
    OneToMany
} from "typeorm";

// Enums
import { EnumStatuses } from "@common/enums";

// Entities
import { InventoryMaterial } from "./InventoryMaterial";
import { User } from "./User";

@Entity()
export class Inventory extends BaseEntity {
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
    public closed: boolean;

    @Column()
    public status: EnumStatuses = EnumStatuses.ACTIVE;

    // Relations

    @ManyToOne(() => User, ({ inventories }: User) => inventories, {
        eager: true
    })
    public user: User; // FK

    @OneToMany(() => InventoryMaterial, ({ inventory }: InventoryMaterial) => inventory)
    public inventoryMaterials: InventoryMaterial[];

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
