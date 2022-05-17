import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { Userr } from "../entity/Userr"

export class UserController {

    private userRepository = AppDataSource.getRepository(Userr)

    /**async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find()
    }*/

    async one(request: Request, response: Response, next: NextFunction) {
        return await this.userRepository.findOne({
            where: {
                email : request.body.email,
                password: request.body.password
            }
        })
    }

    async save(request: Request, response: Response, next: NextFunction) {
        let user =  await this.userRepository.findOne({
            where: {
                email : request.body.email
            }
        })
        if(user == null){        
            const result = await this.userRepository.save(request.body)

            if(result instanceof Promise){
                result.then((result) => {
                    if(result !== null && result !== undefined){
                        response.render("successCadastro.hbs", {user : result.firstName +" "+ result.lastName})
                    }else{
                        console.log("Erro ao realizar cadastro")
                        //Redirecionar para página de cadastro
                    }
                })
            }  
        }else{
            response.render("userCadastrarErr.hbs", {email: request.body.email})
        }
    }

    async logar(request: Request, response: Response, next: NextFunction, recaptcha: any) {
        let user =  this.one(request, response, next)

        if(user !== null){        
            if(user instanceof Promise){
                user.then((user) => {
                    if(user !== null && user !== undefined){
                        request.session.login = true
                        request.session.user =  user.firstName +" "+ user.lastName
                        request.session.email = user.email

                        const adms = require('../public/adm.json');
                        adms.emails.forEach((email) => {
                            if(request.session.email == email){
                                request.session.administrador = true;
                            }
                        });
                        response.render('prisma.hbs', {login: request.session.login, user: request.session.user, adm: request.session.administrador})
                    }else{
                        console.log("primeiro")
                        request.session.relogin = true
                        response.render("login.hbs", {captcha: recaptcha.render(), captchaErr : false, status: "", relogin: true});
                    }
                }); 
            }else if(user !== null && user !== undefined){
                console.log("segundo")
                request.session.relogin = false
                response.render("login.hbs", {captcha: recaptcha.render(), captchaErr : true, status: "Falha no Login", relogin: false});
            }
        }else{
            request.session.relogin = true
            response.render("login.hbs", {captcha: recaptcha.render(), captchaErr : false, status: "", relogin: true});
        }
    }
        

    /** Implementar remoção de conta
    async remove(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.userRepository.findOneBy({ email: request.body.email })
        await this.userRepository.remove(userToRemove)
    }*/

}