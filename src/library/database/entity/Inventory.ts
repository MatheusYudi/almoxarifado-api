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
    OneToMany
} from "typeorm";

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

    @Column({ default: false })
    public closed: boolean;

    // Relations

    @ManyToOne(() => User, ({ inventories }: User) => inventories, {
        eager: true
    })
    public user: User; // FK

    @OneToMany(() => InventoryMaterial, ({ inventory }: InventoryMaterial) => inventory, {
        eager: true,
        cascade: true,
        nullable: false
    })
    public inventoryMaterials: InventoryMaterial[];

    // Triggers
}
