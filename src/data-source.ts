
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Userr } from "./entity/Userr"
import { Session } from "./entity/Session"


export const AppDataSource = new DataSource({
    type: "postgres",
    host: "motty.db.elephantsql.com",
    port: 5432,
    username: "fuibglyn",
    password: "j2qZThUzxPhA-oMe4IDxTYIk9JYBzSl1",
    database: "fuibglyn",
    synchronize: true,
    logging: false,
    entities: [Userr, Session],
    migrations: [],
    subscribers: [],
})
<<<<<<< HEAD
//Configuração testada - conexão estabelecida com sucesso. (Ver política de troca de password)
/**export const AppDataSource = new DataSource({
    type: "postgres",
    host: "motty.db.elephantsql.com",
    port: 5432,
    username: "fuibglyn",
    password: "j2qZThUzxPhA-oMe4IDxTYIk9JYBzSl1",
    database: "fuibglyn",
    synchronize: true,
    logging: false,
    entities: [Userr, Session],
    migrations: [],
    subscribers: [],
})*/
=======

>>>>>>> 834781689f116d447a7c9590b30dea42c810152b
