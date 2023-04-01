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
            
            fc.nome = fc.nome.trim()

            let encryptFc = await this.cifrador.encryptFaleConosco(fc)
            
            const result = await this.FCRepository.save(encryptFc)
      
            if(result !== null && result !== undefined){
                return true;
            }else{
                response.render("fcFeedback.hbs", {mensagem: "Tente novamente mais tarde."})
            }
    }

    async all() {
        let find_fc = await this.FCRepository.find()
        let fc_arr = []
       
        find_fc.forEach((fc) => {
            let decryptFc = this.cifrador.decryptFaleConosco(fc)
            decryptFc.then((dcFc)=> {
                fc_arr.push(dcFc)
            })
        })           
        return fc_arr
    }
    async allselected(name : any) {
        let find_fc = await this.FCRepository.find({
            where : {
                nome : name
            }
        })
        let fc_arr = []
       
        find_fc.forEach((fc) => {
            let decryptFc = this.cifrador.decryptFaleConosco(fc)
            decryptFc.then((dcFc)=> {
                fc_arr.push(dcFc)
            })
        })           
        return fc_arr
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