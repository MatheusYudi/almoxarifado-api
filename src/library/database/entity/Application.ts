// Libs
import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Application extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: string;

    @Column({ unique: true })
    public key: string;

    @Column({ unique: true })
    public label: string;
}
