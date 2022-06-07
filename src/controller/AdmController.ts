import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { Adm } from "../entity/Adm"

export class AdmController {
    private admsRepository = AppDataSource.getRepository(Adm)
    async all(request: Request, response: Response, next: NextFunction) {
        return this.admsRepository.find()
    }
    async save(adm: Adm) {
        this.admsRepository.save(adm)
    }
}