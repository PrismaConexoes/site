import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class Userr {

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    gender: string

    @Column()
    age: Date

    @PrimaryColumn()
    email: string

    @Column()
    phone: string

    @Column()
    password: string

    @Column()
    check: boolean

}
