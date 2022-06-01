import { Entity, PrimaryColumn } from "typeorm"

@Entity()
export class Adm {

    @PrimaryColumn()
    email: string

}
