
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Userr } from "./entity/Userr"
import { Session } from "./entity/Session"
import { Publicacao } from "./entity/Publicacao"
import { AcountValidator } from "./entity/AcountValidator"
import { Adm } from "./entity/Adm"
import { TrocaEmail } from "./entity/TrocaEmail"
import { FaleConosco } from "./entity/FaleConosco"
import { Contato } from "./entity/Contato"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "postgres-ag-br1-3.conteige.cloud",
    port: 54214,
    username: "yjfvtd_dtsrvhjkp",
    password: "hu&yt5MMj$lm",
    database: "yjfvtd_juybngytt",
    //ssl: { rejectUnauthorized: false },
    synchronize: true,
    logging: false,
    entities: [Userr, Session, Publicacao, AcountValidator, Adm, TrocaEmail, FaleConosco, Contato],
    migrations: [],
    subscribers: [],
})



