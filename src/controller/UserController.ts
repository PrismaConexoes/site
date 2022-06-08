import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { Userr } from "../entity/Userr"
import { AcountValidatorController } from "./AcountValidatorController"


export class UserController {

    private userRepository = AppDataSource.getRepository(Userr)
    private acountValidator = new AcountValidatorController

    async one(request: Request) {
        console.log("userControlerOne")
        console.log("email: "+request.body.email)
        return this.userRepository.findOne({
            where: {
                email : request.body.email
            }
        })
    }
    async oneBySession(request: Request) {
        return this.userRepository.findOne({
            where: {
                email : request.session.email
            }
        })
    }
    async save(request: Request, response: Response, next: NextFunction, recaptcha: any) {
        let user = await this.userRepository.findOne({
            where: {
                email : request.body.email
            }
        })
    
        if(user == null){    

            let usuario = request.body
            delete usuario['g-recaptcha-response']
            usuario.valid = false
            usuario.atualizarEmail = false  

            const result = await this.userRepository.save(usuario)
      
            if(result !== null && result !== undefined){
                
                this.acountValidator.saveSecret(usuario, response, true)
            }else{
                response.render("cadastrar.hbs", {captcha: recaptcha.render(), captchaErr : false})
            }
        }else{
            response.render("userCadastrarErr.hbs", {email: request.body.email})
        }
    }
        
    async removeUser(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.userRepository.findOneBy({ email: request.session.email })
        let user  = await this.userRepository.remove(userToRemove)
        if(user instanceof Userr){
            return true
        }
        return false
    }

}