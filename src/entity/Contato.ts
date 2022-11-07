import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Contato {

    @PrimaryGeneratedColumn()
    id: number 
    
    @Column()
    nome: string

    @Column()
    email: string

    @Column()
    assunto: string

    @Column()
    mensagem: string
}