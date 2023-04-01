import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { TrocaEmail } from "../entity/TrocaEmail"

export class TrocaEmailController {
    private trocaEmailRepository = AppDataSource.getRepository(TrocaEmail)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.trocaEmailRepository.find()
    }
    async remove(trocaEmail: TrocaEmail) {
        let result = await this.trocaEmailRepository.remove(trocaEmail)
        if(result instanceof TrocaEmail){
            return true
        }else{
            return false
        }
    } 
    async one(email: string) {
        let result = await this.trocaEmailRepository.findOne({
            where: {
                emailAtual : email
            }
        })
        if(result instanceof TrocaEmail){
            return result
        }else{
            return null 
        }
    }
    async save(trocaEmail: TrocaEmail) {
        this.trocaEmailRepository.save(trocaEmail)
    }
}