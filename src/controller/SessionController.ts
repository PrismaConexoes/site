import { NextFunction, Request, Response } from "express"
import { AcountValidator } from "../entity/AcountValidator"
import { AdmController } from "./AdmController"
import getFeed from "../feed"

export class SessionController {

    private admController = new AdmController

    async prismaSess(request : Request){
        if(!request.session.login){
            request.session.user = ''
            request.session.login = false
        }
        if(!request.session.administrador){
            request.session.administrador = false
        }
        request.session.relogin = false  
    }
    async sairSess(request : Request){
        /* request.session.login = false
        request.session.email = ''
        request.session.relogin = false
        request.session.user = ''
        request.session.validating = false
        request.session.administrador = false
        request.session.secret = '' */ 
        request.session.destroy  
    }
    async loginSess(request : Request, user: any, relogin: boolean){
        request.session.email = request.body.email 
        if(relogin){
            request.session.relogin = true
        }else{
            request.session.login = true
            request.session.user =  user.firstName +" "+ user.lastName
        }

       
    }
    async admSess(request: Request){
        request.session.administrador = true;
    } 
    async cadastrarSess(request : Request){
        
        request.session.relogin = false 
        if(!request.session.login){
            request.session.user = ''
            request.session.login = false
        }
    }
    async secretSess(request : Request){
        request.session.secret = request.params.secret
    }

    async validatingSess(request : Request, validador: AcountValidator){
        
        request.session.newAcount = validador.newAcount
        request.session.email = validador.email
        if(validador.newAcount){ request.session.validating = true  }
        request.session.login = false
        request.session.newEmail = validador.newEmail
        
    }
    async validatingEndSess(request : Request){
        request.session.validating = false
        request.session.secret = null
        request.session.newAcount = null
    }

    async logar(request: Request, response: Response, next: NextFunction, recaptcha: any, user: any) {

        let senha = user.password
         
        if(senha == request.body.password){
            if(user.valid == true){

                this.loginSess(request, user, false)
                this.admController.all(request, response, next)
                .then((adms)=>{
                    adms.forEach((adm) => {
                            if(request.session.email == adm.email){ this.admSess(request) }
                        })
                }).then(()=>{
                    let feed  = getFeed();
                    feed.then((feed)=>{
                        response.render('prisma.hbs', {login: request.session.login, user: request.session.user, adm: request.session.administrador,
                            rss: feed})
                    })
                })
            }else{

                request.session.email = request.body.email
                response.render('avisoDeChecagem.hbs')
            }
        }else{
            request.session.relogin = true
            response.render("login.hbs", {captcha: recaptcha.render(), captchaErr : false, status: "", relogin: true});
        }   
           
    }

 
}