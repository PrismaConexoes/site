import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class FaleConosco {

    @PrimaryGeneratedColumn()
    id: number 
    
    @Column()
    nome: string

    @Column()
    sobrenome: string

    @Column()
    telefone: string

    @Column()
    mensagem: string
}