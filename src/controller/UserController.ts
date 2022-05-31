import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { Userr } from "../entity/Userr"
import { AcountValidatorController } from "./AcountValidatorController"
import { v4 as uuidv4 } from 'uuid';

export class UserController {

    private userRepository = AppDataSource.getRepository(Userr)
    private acountValidator = new AcountValidatorController

    /**async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find()
    }*/

    async one(request: Request) {
        return this.userRepository.findOne({
            where: {
                email : request.body.email
            }
        })
    }
    async conta(request: Request, response: Response, next: NextFunction) {
        let user = await this.userRepository.findOne({
            where: {
                email : request.session.email
            }
        })
        console.log(user)
        if(user !== null && user !== undefined){
            response.render("conta.hbs", {usuario : user, user: user.firstName, login : request.session.login})
        }else{
            console.log("Ocorreu um erro ao recuperar o usuário no BD.") //criar page
        }
    }
    async updateValid(user: Userr){
        user.valid = true
        let result = await this.userRepository.update({ email: user.email }, user)  
        if(result.affected == 1){
           return this.acountValidator.updateAccount(user)
        }
        return false
    }
    async atualizarConta(request: Request, response: Response, next: NextFunction) {
        let dados = request.body
        console.log(dados)
        if(dados !== null && dados !== undefined){
            let result = await this.userRepository.update({ email: request.session.email }, dados)
            if(result.affected == 1){
                request.session.email = dados.email
                let usuario = await this.userRepository.findOne({
                    where: {
                        email : dados.email
                    }
                })
                response.render("conta.hbs", {usuario : usuario, user: usuario.firstName, login : request.session.login})
            }
        }else{
            console.log("Ocorreu um erro.") //criar page
        }
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

            const result = await this.userRepository.save(usuario)
      
            if(result !== null && result !== undefined){
                //gerarchaveaqui
                let uid = uuidv4()
                console.log("uid: "+uid)
                //AcountValidator
                this.acountValidator.saveSecret(usuario, uid, response)
                //response.render("validarConta.hbs", {nome: usuario.firstName+" "+usuario.lastName})
            }else{
                response.render("cadastrar.hbs", {captcha: recaptcha.render(), captchaErr : false})
            }
        }else{
            response.render("userCadastrarErr.hbs", {email: request.body.email})
        }
    }

    async logar(request: Request, response: Response, next: NextFunction, recaptcha: any) {

        let user = this.one(request)

        if(user !== null && user !== undefined){
            user.then((user)=>{
                if(user.password == request.body.password){
                    if(user.valid == true){
                        request.session.login = true
                        request.session.user =  user.firstName +" "+ user.lastName
                        request.session.email = user.email
            
                        const adms = require('../public/adm.json');
                        adms.emails.forEach((email) => {
                            if(request.session.email == email){
                                request.session.administrador = true;
                            }
                        });
                        //Login Efetuado Com Sucesso
                        response.render('prisma.hbs', {login: request.session.login, user: request.session.user, adm: request.session.administrador})
                    }else{
                        console.log("Deve-se checar a conta.")
                        //Avisar para o usuário checar conta
                    }
                }    
            })     
        }else{
            //Usuário Não Encontrado
            request.session.relogin = true
            response.render("login.hbs", {captcha: recaptcha.render(), captchaErr : false, relogin: true});
        }
    }
        

    /** Implementar remoção de conta
    async remove(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.userRepository.findOneBy({ email: request.body.email })
        await this.userRepository.remove(userToRemove)
    }*/

}