import { AppDataSource } from "../data-source" 
import { Request, Response, NextFunction } from "express"
import { v4 as uuidv4 } from 'uuid';
import { AcountValidator } from "../entity/AcountValidator"
import { User } from "../entity/User"
import { EmailController } from "./EmailController";



export class AcountValidatorController {

    private validatorRepository = AppDataSource.getRepository(AcountValidator)
    private emailController = new EmailController

    async oneByEmail(email : any) {
        let val = await this.validatorRepository.findOne({
            where: {
                email : email
            }
        })
        if(val instanceof AcountValidator){
            return val
        }else{
            return null
        }
    }
    async remove(validador: AcountValidator){
        await this.validatorRepository.remove(validador) 
    }
   async remVencidos(){

        let all_val = await this.validatorRepository.find()
        let vencidos = []

        all_val.forEach(el => {

            let dataNow = Date.now()
            let databack = Date.parse(el.data.toString())
            let diff = dataNow - databack
            let email = el.email
            if(diff > 3600000){
                vencidos.push(email)
                this.validatorRepository.remove(el) 
            }
        })
        return vencidos
    }


    async oneBySessionSecret(request: Request) {

        let result = await this.validatorRepository.findOne({
            where: {
                parameter : request.session.secret
            }
        })

        return result    
    }
  
    async oneBySession(request: Request) {

        let result = this.validatorRepository.findOne({
            where: {
                email : request.session.email
            }
        })
        if(result !== null && result !== undefined){
                return result
            }
        return null    
    }

    async validarAccount(user: User){
       
        let validator = await this.validatorRepository.findOneBy({ email : user.email })
        let result = await this.validatorRepository.remove(validator)
        if(result instanceof AcountValidator){
            return true
        }
        return false
    }

    async saveSecret(user: User, request: Request, response: Response, novaConta: boolean){
        let previous = await this.validatorRepository.findOne({
            where:{
                email: user.email,
            }              
        })
        if(previous == null){

            let secret = uuidv4()

            let email = user.email
            let newEmail = ''
            if(novaConta == false){
                newEmail = request.body.email
            }
            let entry = {email: email, newEmail: newEmail, parameter: secret, data: new Date(), newAcount : novaConta}
            let result = await this.validatorRepository.save(entry)


            if(novaConta){
                this.emailController.enviar(email, secret, novaConta)
            }else{
                this.emailController.enviar(newEmail, secret, novaConta)   
            }
            

            if(result !== null && result !== undefined){
               
                response.render("avisoDeChecagem.hbs")
                
            }else{
                response.render("errSolicitacao.hbs")
            }
        }else{
            response.render("errSolicitacao.hbs")
        }
    } 
}