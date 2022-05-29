// Libs
import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

// Entities
import { User } from "./User";

@Entity()
export class AccessGroup extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column({ unique: true })
    public name: string;

    @OneToMany(() => User, ({ accessGroup }: User) => accessGroup)
    public users: User[];
}
