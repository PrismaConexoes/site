import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class AcountValidator {

    @PrimaryColumn()
    email: string

    @Column()
    parameter: string

    @Column()
    data: Date
    
}