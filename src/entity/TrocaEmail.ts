import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class TrocaEmail {

    @PrimaryColumn()
    emailAtual: string

    @Column()
    emailNovo: string

    @Column()
    newPhone: string

    @Column()
    newPassword: string

    
}