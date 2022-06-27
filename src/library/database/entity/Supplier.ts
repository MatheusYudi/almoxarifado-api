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
import { EnumBrazilStates, EnumCalculationRegimes, EnumStateRegistrationTypes, EnumStatuses } from "@common/enums";

// Entities
import { Invoice } from "./Invoice";

@Entity()
export class Supplier extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @DeleteDateColumn()
    public deletedAt: Date;

    @Column({ unique: true })
    public document: string; // CNPJ

    @Column()
    public stateRegistrationType: EnumStateRegistrationTypes;

    @Column({ unique: true })
    public stateRegistration: string;

    @Column({ unique: true })
    public corporateName: string;

    @Column({ unique: true })
    public tradingName: string;

    @Column()
    public calculationRegime: EnumCalculationRegimes;

    @Column()
    public state: EnumBrazilStates;

    @Column()
    public postalCode: string;

    @Column()
    public address: string;

    @Column()
    public addressNumber: number;

    @Column()
    public city: string;

    @Column()
    public district: string;

    @Column()
    public complement?: string;

    @Column()
    public status: EnumStatuses = EnumStatuses.ACTIVE;

    // Relations

    @OneToMany(() => Invoice, ({ supplier }: Invoice) => supplier)
    public invoices: Invoice[];

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
