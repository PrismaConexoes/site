import { AppDataSource } from "../data-source" 
import { Request, Response } from "express"
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
    async oneByEmail(request: Request) {
        let result = this.validatorRepository.findOne({
            where: {
                email : request.params.email
            }
        })
        if(result !== null && result !== undefined){
                return result
            }
        return null    
    }

    async updateAccount(user: Userr){
       
        this.validatorRepository.findOneBy({ email : user.email })
        .then((validator)=>{
            let removed = this.validatorRepository.remove(validator)
            removed.then((result)=>{
                if(result instanceof AcountValidator){
                    return true
                }
            })
        })
        return false
    }

    async saveSecret(user: Userr, response: Response){
        let previous = await this.validatorRepository.findOne({
            where:{
                email: user.email,
            }              
        })
        if(previous == null){

            let secret = uuidv4()
            let entry = {email: user.email, parameter: secret, data: new Date()}
            let result = await this.validatorRepository.save(entry)

            this.emailController.enviar(user.email, secret)

            if(result !== null && result !== undefined){
               
                response.render("avisoDeChecagem.hbs")
                
            }else{
                console.log("Ocorreu um erro ao salvar a validação no banco")
            }
        }else{
            console.log("O seguinte dado de validação está no banco: "+previous )
        }
    } 
}