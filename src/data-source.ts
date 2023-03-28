
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Userr } from "./entity/Userr"
import { Session } from "./entity/Session"
import { AcountValidator } from "./entity/AcountValidator"
import { Adm } from "./entity/Adm"
import { TrocaEmail } from "./entity/TrocaEmail"
import { FaleConosco } from "./entity/FaleConosco"
import { Contato } from "./entity/Contato"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "postgres-ag-br1-3.conteige.cloud",
    port: 54233,
    username: "bclunv_r8xmgwwdj",
    password: "NyuMx]FD++Zb$t8C",
    database: "bclunv_4rndsqqmg",
    
    synchronize: true,
    logging: false,
    entities: [Userr, Session, AcountValidator, Adm, TrocaEmail, FaleConosco, Contato],
    migrations: [],
    subscribers: [],
})



