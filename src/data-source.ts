
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Userr } from "./entity/Userr"
import { Session } from "./entity/Session"
import { Publicacao } from "./entity/Publicacao"
import { AcountValidator } from "./entity/AcountValidator"
import { Adm } from "./entity/Adm"



export const AppDataSource = new DataSource({
    type: "postgres",
    host: "ec2-52-3-200-138.compute-1.amazonaws.com",
    port: 5432,
    username: "llqqsxgvaehqkl",
    password: "af8ccf9f8c7f515e3d6b08963ce25ea657752922d9a3f1843c9b46eb1e21a83a",
    database: "d4m4a06ldg6d6a",
    ssl: { rejectUnauthorized: false },
    synchronize: true,
    logging: false,
    entities: [Userr, Session, Publicacao, AcountValidator, Adm],
    migrations: [],
    subscribers: [],
})
/*export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "prismaapp",
    database: "prismaapp",
    //ssl: { rejectUnauthorized: false },
    synchronize: true,
    logging: false,
    entities: [Userr, Session, Publicacao, AcountValidator, Adm],
    migrations: [],
    subscribers: [],
})*/



