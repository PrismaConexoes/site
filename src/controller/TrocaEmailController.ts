import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { TrocaEmail } from "../entity/TrocaEmail"

export class TrocaEmailController {
    private trocaEmailRepository = AppDataSource.getRepository(TrocaEmail)
    async all(request: Request, response: Response, next: NextFunction) {
        return this.trocaEmailRepository.find()
    }
    async remove(trocaEmail: TrocaEmail) {
        await this.trocaEmailRepository.remove(trocaEmail)
    } 
    async one(email: string) {
        let result = this.trocaEmailRepository.findOne({
            where: {
                emailAtual : email
            }
        })
        if(result !== null && result !== undefined){
                return result
            }
        return null    
    }
    async save(trocaEmail: TrocaEmail) {
        this.trocaEmailRepository.save(trocaEmail)
    }
}