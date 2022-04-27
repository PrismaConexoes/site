import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm"

@Entity()
export class Userr {

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    age: number

    @PrimaryColumn()
    email: string

    @Column()
    password: string

}
