import { ISession } from "connect-typeorm";
import { Column, DeleteDateColumn, Entity, Index, IsNull, PrimaryColumn } from "typeorm";

@Entity()
export class Session implements ISession {
    @Index()
    @Column("bigint")
    public expiredAt = Date.now();

    @PrimaryColumn("varchar", { length: 255 })
    public id = "";

    @Column("text")
    public json = "";

    @DeleteDateColumn({nullable: false} )
    public destroyedAt? :  Date;
}