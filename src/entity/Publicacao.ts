import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Publicacao {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    titulo: string

    @Column({
        length: 10
    })
    empresa: string

    @Column()
    linkimg: string

    @Column()
    texto: string

}