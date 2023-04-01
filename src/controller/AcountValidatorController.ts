import { AppDataSource } from "../data-source" 
import { Request, Response, NextFunction } from "express"
import { v4 as uuidv4 } from 'uuid';
import { AcountValidator } from "../entity/AcountValidator"
import { User } from "../entity/User"
import { EmailController } from "../controller/EmailController"
import { UserController } from "./UserController";
import { TrocaEmailController } from "./TrocaEmailController";



export class AcountValidatorController {

    private validatorRepository = AppDataSource.getRepository(AcountValidator)
    private emailController = new EmailController
    private userController = new UserController
    private trocaEmailController = new TrocaEmailController 

    async remove(validador: AcountValidator){
        await this.validatorRepository.remove(validador) 
    }
    async remVencidos(){
        let all_val = await this.validatorRepository.find()
        all_val.forEach(el => {
            let dataNow = Date.now()
            let databack = Date.parse(el.data.toString())
            let diff = dataNow - databack
            let email = el.email
            if(diff > 3600000){
                let val  = this.validatorRepository.remove(el) 
                val.then((result)=>{
                    if(result instanceof AcountValidator){
                       let userToRemove =  this.userController.oneByEmail(email)
                       userToRemove.then((user)=>{
                            let usr = this.userController.removeUser(user)
                            usr.then((res)=>{
                                if(res){
                                    let troca_email = this.trocaEmailController.one(email)
                                    troca_email.then((tc_em)=>{
                                        if(tc_em != null){
                                            let del =  this.trocaEmailController.remove(tc_em)
                                            del.then(()=>{
                                                return true
                                            })
                                        } 
                                    })
                                }
                            })
                       }) 
                    }
                }) 
            } 
        });
        return true
    }
    async oneBySessionSecret(request: Request) {

        await this.remVencidos()
        let result = await this.validatorRepository.findOne({
            where: {
                parameter : request.session.secret
            }
        })

        return result    
    }
  
    async oneBySession(request: Request) {

        await this.remVencidos()
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