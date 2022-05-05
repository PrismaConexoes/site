
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Userr } from "./entity/Userr"
import { Session } from "./entity/Session"
import {createConnection} from "typeorm";


export const AppDataSource = new DataSource({
    type: "postgres",
    host: "ec2-3-229-11-55.compute-1.amazonaws.com",
    port: 5432,
    username: "kvzigtrpwxqcgo",
    password: "452b9897486c976a67eba9d7c9d351bff5ce0d5acf839d7c8bf932239d8efa5b",
    database: "d4ejjer24kuhf9",
    ssl: { key : "arn:aws:kms:us-east-1:312544847090:key/1e464425-f840-4932-9b37-aaf17504511e"},
    synchronize: true,
    logging: false,
    entities: [Userr, Session],
    migrations: [],
    subscribers: [],
})


