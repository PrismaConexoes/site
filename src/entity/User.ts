import { Entity, Column, Generated, PrimaryColumn } from "typeorm"

@Entity()
export class User {

    @Column()
    @Generated("increment")
    id: number 

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
    valid: boolean

    @Column()
    atualizarEmail: boolean

}
