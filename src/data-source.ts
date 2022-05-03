
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Userr } from "./entity/Userr"
import { Session } from "./entity/Session"


export const AppDataSource = new DataSource({
    type: "postgres",
    host: "https://ec2-3-229-252-6.compute-1.amazonaws.com",
    port: 5432,
    username: "dmipgolrmbdpvf",
    password: "7a5e3c1a09f37d1e14e458a98ed4b54b9092c50c808b6fc178ae934b26625640",
    database: "d8hdk425hc1sd0",
    synchronize: true,
    logging: false,
    entities: [Userr, Session],
    migrations: [],
    subscribers: [],
})
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
