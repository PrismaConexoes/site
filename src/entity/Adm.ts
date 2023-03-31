import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Adm {

    @PrimaryGeneratedColumn()
    id: number 

    @Column()
    email: string

}
