import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { Userr } from "../entity/Userr"
import { AcountValidatorController } from "./AcountValidatorController"
import { TrocaEmailController } from "./TrocaEmailController"
import { TrocaEmail } from "../entity/TrocaEmail"
import { AcountValidator } from "../entity/AcountValidator"

export class ContaController {

    private userRepository = AppDataSource.getRepository(Userr) //Centralizar no userController??
    private acountValidator = new AcountValidatorController
    private trocaEmailController = new TrocaEmailController


    async admConta(request: Request, response: Response, next: NextFunction) {
        let user = await this.userRepository.findOne({
            where: {
                email : request.session.email
            }
        })
        if(user instanceof Userr){
            response.render("conta.hbs", {usuario : user, user: user.firstName, login : request.session.login, atualizacao : false})
        }else{
            response.render("errSolicitacao.hbs")
        }
    }

    async validarConta(user: Userr){
        user.valid = true
        let result = await this.userRepository.update({ email: user.email }, user)
        console.log(result)  
        if(result.affected == 1){
            return this.acountValidator.validarAccount(user)
        }
        return false
    }
    
    async efetiveAtualizacao(request: Request, response: Response, next: NextFunction) {
        let usuario = await this.userRepository.findOne({
            where: {
                email : request.session.email
            }
        })
        
        let ctrl = false
             
        if(usuario.atualizarEmail == false){
            usuario.phone = request.body.phone
            usuario.password = request.body.password //Implementar Retype password
            this.userRepository.update({ email: request.session.email }, usuario)
            ctrl = true      
        }else{
            this.acountValidator.one(request).then((validador)=>{
                if(validador instanceof AcountValidator){
                    if(!validador.newAcount){
                        this.trocaEmailController.one((validador.email)).then((trocaEmail)=>{
                            if(trocaEmail instanceof TrocaEmail){
                                this.userRepository.findOneBy({email: validador.email}).then((user)=>{
                                    if(user instanceof Userr){
                                        user.email = trocaEmail.emailNovo
                                        user.phone = trocaEmail.newPhone
                                        user.password = trocaEmail.newPassword
                                        user.atualizarEmail = false
                                        request.session.email = trocaEmail.emailNovo //Acompanhar
                                        this.userRepository.update({ email: validador.email }, user)
                                        this.acountValidator.remove(validador)
                                        this.trocaEmailController.remove(trocaEmail)
                                        ctrl = true
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }

        if(ctrl){
            response.render("conta.hbs", {usuario : usuario, user: usuario.firstName, login : request.session.login, atualizacao : true})
        }else{
            response.render("errSolicitacao.hbs")
        }

    }
    async atualizarConta(request: Request, response: Response, next: NextFunction) {
        let dados = request.body
        if(dados !== null && dados !== undefined){
           
            if(request.session.email == request.body.email){
                console.log("milestone1")
                this.efetiveAtualizacao(request, response, next)
            }else{

                //Salvando um objeto do tipo TrocaEmail
                let trocaEmail = new TrocaEmail
                trocaEmail.emailAtual = request.session.email
                trocaEmail.emailNovo = request.body.email
                trocaEmail.newPhone = request.body.phone
                trocaEmail.newPassword = request.body.password
                await this.trocaEmailController.save(trocaEmail)

                //Recuperar usuário
                let usuario = await this.userRepository.findOne({
                    where: {
                        email : request.session.email
                    }
                })

                
                //atualização do usuário
                usuario.atualizarEmail = true
                let result = await this.userRepository.update({ email: usuario.email }, usuario)
                
                if(result.affected == 1){
                    
                    await this.acountValidator.saveSecret(usuario, response, false)

                }else{
                    response.render("errSolicitacao.hbs")
                }
            }
        }else{
            response.render("errSolicitacao.hbs")
        }
    }
}