// Libs
import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany } from "typeorm";
import { Material } from "./Material";

@Entity()
export class NCM extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column({ unique: true })
    public code: string;

    @Column({ type: "text" })
    public description: string;

    // Relations

    @OneToMany(() => Material, ({ ncm }: Material) => ncm)
    public materials: Material[];

    // Triggers
}
