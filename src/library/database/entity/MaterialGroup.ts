// Libs
import {
    BaseEntity,
    BeforeSoftRemove,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

// Enums
import { EnumStatuses } from "@common/enums";

// Entities
import { Material } from "./Material";

@Entity()
export class MaterialGroup extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @DeleteDateColumn()
    public deletedAt: Date;

    @Column({ unique: true })
    public name: string;

    @Column()
    public status: EnumStatuses = EnumStatuses.ACTIVE;

    // Relations

    @OneToMany(() => Material, ({ materialGroup }: Material) => materialGroup)
    public materials: Material[];

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
