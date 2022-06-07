import { AppDataSource } from "../data-source" 
import { Request, Response, NextFunction } from "express"
import { v4 as uuidv4 } from 'uuid';
import { AcountValidator } from "../entity/AcountValidator"
import { Userr } from "../entity/Userr"
import { EmailController } from "../controller/EmailController"



export class AcountValidatorController {

    private validatorRepository = AppDataSource.getRepository(AcountValidator)
    private emailController = new EmailController


    async one(request: Request) {
        let result = this.validatorRepository.findOne({
            where: {
                parameter : request.params.secret
            }
        })
        if(result !== null && result !== undefined){
                return result
            }
        return null    
    }
    async remove(validador: AcountValidator) {
        await this.validatorRepository.remove(validador)
    }   
    async oneByEmail(request: Request) {
        let result = this.validatorRepository.findOne({
            where: {
                email : request.body.email
            }
        })
        if(result !== null && result !== undefined){
                return result
            }
        return null    
    }

    async validarAccount(user: Userr){
       
        let validator = await this.validatorRepository.findOneBy({ email : user.email })
        let result = await this.validatorRepository.remove(validator)
        if(result instanceof AcountValidator){
            return true
        }
        return false
    }

    async saveSecret(user: Userr, response: Response, novaConta: boolean){
        let previous = await this.validatorRepository.findOne({
            where:{
                email: user.email,
            }              
        })
        if(previous == null){

            let secret = uuidv4()
            let entry = {email: user.email, parameter: secret, data: new Date(), newAcount : novaConta}
            let result = await this.validatorRepository.save(entry)

            this.emailController.enviar(user.email, secret, novaConta)

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