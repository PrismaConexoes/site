import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { Userr } from "../entity/Userr"
import { AcountValidatorController } from "./AcountValidatorController"
import { TrocaEmailController } from "./TrocaEmailController"
import { TrocaEmail } from "../entity/TrocaEmail"
import { SessionController } from "./SessionController"
import { Cifra } from "./Cifra"
import getFeed from "../feed"

export class ContaController {

    private userRepository = AppDataSource.getRepository(Userr) //Centralizar no userController??
    private acountValidator = new AcountValidatorController
    private trocaEmailController = new TrocaEmailController
    private sessionCtrl = new SessionController
    private CryptoJS = require("crypto-js");
    private cifrador = new Cifra


    async admConta(request: Request, response: Response, next: NextFunction) {
        let usr = await this.userRepository.findOne({
            where: {
                email : request.session.email
            }
        })
        if(usr instanceof Userr){
            
            let user = await this.cifrador.decryptUser(usr)

            let feed  = getFeed();
            feed.then((feed)=>{
                response.render("conta.hbs", {usuario : user, user: user.firstName, login : request.session.login, atualizacao : false, rss : feed})
            })

        }else{
            response.render("errSolicitacao.hbs")
        }
    }

    async validarConta(user: Userr){
        user.valid = true

        let refreshUser = await this.cifrador.encryptUser(user)

        let result = await this.userRepository.update({ email: user.email }, refreshUser)
  
        if(result.affected == 1){
            return this.acountValidator.validarAccount(user)
        }
        return false
    }
    
    async efetiveAtualizacao(request: Request, response: Response, pass: any, next: NextFunction) {
        let usuario = await this.userRepository.findOne({
            where: {
                email : request.session.email
            }
        })
        
             
        if(usuario.atualizarEmail == false){
            usuario.phone = request.body.phone
            usuario.password = pass
            this.userRepository.update({ email: request.session.email }, usuario)
            usuario.password = request.body.password
            response.render("conta.hbs", {usuario : usuario, user: usuario.firstName, login : request.session.login, atualizacao : true})
                 
        }else{
            this.acountValidator.oneBySessionSecret(request).then((validador)=>{
                if(validador !== null){
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
                                        this.sessionCtrl.sairSess(request)
                                        response.render('atualizacaoSucess.hbs')
                                    }else{
                                        response.render('errSolicitacao.hbs')
                                    }
                                })
                            }else{
                                response.render('errSolicitacao.hbs')
                            }
                        })
                    }else{
                        response.render('errSolicitacao.hbs')
                    }
                }else{
                    response.render('errSolicitacao.hbs')
                }
            })
        }
        


    }
    async atualizarConta(request: Request, response: Response, next: NextFunction) {
        let dados = request.body

        // Encrypt
        var ciphertext = await this.CryptoJS.AES.encrypt(dados.password, '53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString();

        if(dados !== null && dados !== undefined){
           
            if(request.session.email == request.body.email){
              
                this.efetiveAtualizacao(request, response, ciphertext, next)
            }else{

                //Salvando um objeto do tipo TrocaEmail
                let trocaEmail = new TrocaEmail
                trocaEmail.emailAtual = request.session.email
                trocaEmail.emailNovo = request.body.email
                trocaEmail.newPhone = request.body.phone
                trocaEmail.newPassword = ciphertext
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
                    
                    await this.acountValidator.saveSecret(usuario, request, response, false)

                }else{
                    response.render("errSolicitacao.hbs")
                }
            }
        }else{
            response.render("errSolicitacao.hbs")
        }
    }
}