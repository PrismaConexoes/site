import { NextFunction, Request, Response } from "express"
import { Userr } from "../entity/Userr"
import { AdmController } from "./AdmController"

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
        request.session.login = false
        request.session.email = false
        request.session.relogin = false
        request.session.user = ''
        request.session.validating = false
        request.session.administrador = false
        request.session.secret = ''   
    }
    async loginSess(request : Request, user: Userr, relogin: boolean){
        if(relogin){
            request.session.relogin = true
        }else{
            request.session.login = true
            request.session.user =  user.firstName +" "+ user.lastName
            request.session.email = user.email
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
    async validatingSess(request : Request, email: string){
        request.session.secret = request.params.secret
        request.session.email = email
        request.session.validating = true  
    }
    async validatingEndSess(request : Request){
        request.session.validating = false
        request.session.secret = ''
    }

    async logar(request: Request, response: Response, next: NextFunction, recaptcha: any, user: any) {

        user.then((user)=>{
            if(user.password == request.body.password){
                if(user.valid == true){

                    this.loginSess(request, user, false)
        
                    const adms = this.admController.all(request, response, next)
                    .then((adms)=>{
                        adms.forEach((adm) => {
                                if(request.session.email == adm.email){ this.admSess(request) }
                            })
                    }).then(()=>{
                        response.render('prisma.hbs', {login: request.session.login, user: request.session.user, adm: request.session.administrador})
                    })
                }else{
                    response.render('avisoDeChecagem.hbs')
                }
            }    
        })     
    }

 
}