import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { Userr } from "../entity/Userr"
import { Adm } from "../entity/Adm"
import { AcountValidatorController } from "./AcountValidatorController"
import { Cifra } from "./Cifra"


export class UserController {

    private userRepository = AppDataSource.getRepository(Userr)
    private acountValidator = new AcountValidatorController
    private cifrador = new Cifra

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
    async all() {
        let users = await this.userRepository.find()
        let dcryptUsers = []
        users.forEach((user)=>{
            let decryptUser = this.cifrador.decryptUser(user)
            decryptUser.then((dcUser)=>{
                dcryptUsers.push(dcUser)
            })
        })
        return dcryptUsers
    }
    async allselected(name: any) {
        let find_user = await this.all()
        let sel_user = []
       
        find_user.forEach((user) => {
            if(user.firstName = name){
                sel_user.push(user)
            }
        })
              
        return sel_user
    }
    async save(request: Request, response: Response, next: NextFunction, recaptcha: any) {
        let user = await this.userRepository.findOne({
            where: {
                email : request.body.email
            }
        })
    
        if(user == null){    

            let usuario = request.body
            usuario.firstName =usuario.firstName.trim()
            delete usuario['g-recaptcha-response']
            usuario.valid = false
            usuario.atualizarEmail = false  

            // Encrypt
            let newUser = await this.cifrador.encryptUser(usuario)

            const result = await this.userRepository.save(newUser)
      
            if(result !== null && result !== undefined){
                
                this.acountValidator.saveSecret(newUser, request, response, true)

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