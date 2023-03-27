import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { FaleConosco } from "../entity/FaleConosco"
import { Cifra } from "./Cifra"


export class FaleConoscoController {

    private FCRepository = AppDataSource.getRepository(FaleConosco)
    private cifrador = new Cifra

    async one(request: Request) {
        return this.FCRepository.findOne({
            where: {
                id : request.body.id
            }
        })
    }

    async save(request: Request, response: Response) {  

            let fc = request.body

            let encryptFc = await this.cifrador.encryptFaleConosco(fc)
            
            const result = await this.FCRepository.save(encryptFc)
      
            if(result !== null && result !== undefined){
                response.render("testepage", {d1: true, d2: null})
                //return result;
            }else{
                response.render("fcFeedback.hbs", {mensagem: "Tente novamente mais tarde."})
            }
    }
        
    async removefaleConosco(request: Request, response: Response, next: NextFunction) {
        let FCToRemove = await this.FCRepository.findOneBy({ id: request.body.id })
        let fc  = await this.FCRepository.remove(FCToRemove)
        if(fc instanceof FaleConosco){
            return true
        }
        return false
    }

}