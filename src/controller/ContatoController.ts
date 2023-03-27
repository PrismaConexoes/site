import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { Contato } from "../entity/Contato"
import { Cifra } from "./Cifra"


export class ContatoController {

    private ContatoRepository = AppDataSource.getRepository(Contato)
    private cifrador = new Cifra

    async one(request: Request) {
        return this.ContatoRepository.findOne({
            where: {
                id : request.body.id
            }
        })
    }

    async save(request: Request, response: Response) {  

            let contato = request.body

            let encryptCto =  await this.cifrador.encryptContato(contato)

            const result = await this.ContatoRepository.save(encryptCto)
      
            if(result !== null && result !== undefined){
                return true;
            }else{
                response.render("fcFeedback.hbs", {mensagem: "Tente novamente mais tarde."})
            }
    }
        
    async removefaleConosco(request: Request, response: Response, next: NextFunction) {
        let contatoToRemove = await this.ContatoRepository.findOneBy({ id: request.body.id })
        let contato  = await this.ContatoRepository.remove(contatoToRemove)
        if(contato instanceof Contato){
            return true
        }
        return false
    }

}