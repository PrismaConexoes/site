import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { Userr } from "../entity/Userr"
import { Adm } from "../entity/Adm"
import { AcountValidatorController } from "./AcountValidatorController"


export class UserController {

    private userRepository = AppDataSource.getRepository(Userr)
    private admRepository = AppDataSource.getRepository(Adm)
    private acountValidator = new AcountValidatorController
    private AES = require("crypto-js/aes");

    async one(request: Request) {
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

            // Encrypt
            var ciphertext = this.AES.encrypt(usuario.password, '53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString();
            usuario.password = ciphertext

            const result = await this.userRepository.save(usuario)
      
            if(result !== null && result !== undefined){
                
                this.acountValidator.saveSecret(usuario,request, response, true)

            }else{
                response.render("cadastrar.hbs", {captcha: recaptcha.render(), captchaErr : false})
            }
        }else{
            response.render("userCadastrarErr.hbs", {email: request.body.email})
        }
    }
        
    async removeUser(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.userRepository.findOneBy({ email: request.session.email })
        let admToRemove = await this.admRepository.findOneBy({ email: request.session.email })
        let user  = await this.userRepository.remove(userToRemove)
        let adm  = await this.admRepository.remove(admToRemove)
        if(user instanceof Userr){
            return true
        }
        return false
    }

}