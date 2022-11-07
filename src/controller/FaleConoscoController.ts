import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { FaleConosco } from "../entity/FaleConosco"


export class FaleConoscoController {

    private FCRepository = AppDataSource.getRepository(FaleConosco)

    async one(request: Request) {
        return this.FCRepository.findOne({
            where: {
                nome : request.body.nome
            }
        })
    }

    async save(request: Request, response: Response) {  

            let fconosco = request.body 

            const result = await this.FCRepository.save(fconosco)
      
            if(result !== null && result !== undefined){
                console.log("0000")
                return result;

            }else{
                console.log("1111")
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