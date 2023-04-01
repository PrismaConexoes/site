import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { AcountValidatorController } from "./AcountValidatorController"
import { Cifra } from "./Cifra"


export class UserController {

    private userRepository = AppDataSource.getRepository(User)
    private acountValidator = new AcountValidatorController
    private cifrador = new Cifra

    async one(request: Request) {
        return this.userRepository.findOne({
            where: {
                email : request.body.email
            }
        })
    }
    async oneById(id : any) {
        let user = await this.userRepository.findOne({
            where: {
                id : parseInt(id)
            }
        })
        return user
    }
    async oneByEmail(email: any) {
        let user = await this.userRepository.findOne({
            where: {
                email : email
            }
        })
        return user
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
            if(user.firstName == name){
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
            usuario.email = usuario.email.trim()
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
        
    async removeUser(user : User) {

        let usr  = await this.userRepository.remove(user)
        if(usr instanceof User){
            return true
        }
        return false
    }

}