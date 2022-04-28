import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm"

@Entity()
export class Userr {

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    age: Date

    @PrimaryColumn()
    email: string

    @Column()
    password: string

}
