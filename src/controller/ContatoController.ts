import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { Contato } from "../entity/Contato"
import { Cifra } from "./Cifra"


export class ContatoController {

    private ContatoRepository = AppDataSource.getRepository(Contato)
    private cifrador = new Cifra

    async oneById(id : any) {
        let ctt = await this.ContatoRepository.findOne({
            where: {
                id : parseInt(id)
            }
        })
        return ctt
    }
    async allselected(name: any) {
        let find_cont = await this.ContatoRepository.find({
            where: {
                nome : name
            }
        })
        let cont_arr = []
       
        find_cont.forEach((ctt) => {
            let decryptCtt = this.cifrador.decryptContato(ctt)
            decryptCtt.then((dcCtt)=> {
                cont_arr.push(dcCtt)
            })
        })
              
        return cont_arr
    }

    async save(request: Request, response: Response) {  

            let contato = request.body
            contato.nome = contato.nome.trim()

            let encryptCto =  await this.cifrador.encryptContato(contato)

            const result = await this.ContatoRepository.save(encryptCto)
      
            if(result !== null && result !== undefined){
                return true;
            }else{
                response.render("fcFeedback.hbs", {mensagem: "Tente novamente mais tarde."})
            }
    }
    async all() {
        let find_cont = await this.ContatoRepository.find()
        let cont_arr = []
       
        find_cont.forEach((ctt) => {
            let decryptCtt = this.cifrador.decryptContato(ctt)
            decryptCtt.then((dcCtt)=> {
                cont_arr.push(dcCtt)
            })
        })
              
        return cont_arr
    }     
    async removeContato(ctt : Contato) {
        let contato  = await this.ContatoRepository.remove(ctt)
        if(contato instanceof Contato){
            return true
        }
        return false
    }

}