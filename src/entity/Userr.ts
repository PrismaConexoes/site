import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class Userr {

    @Column()
    firstName: string

    @Column()
    lastName: string

    @PrimaryColumn()
    gender: string

    @Column()
    age: Date

    @PrimaryColumn()
    email: string

    @PrimaryColumn()
    phone: string

    @Column()
    password: string

}
