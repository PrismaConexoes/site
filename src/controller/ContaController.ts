import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { AcountValidatorController } from "./AcountValidatorController"
import { TrocaEmailController } from "./TrocaEmailController"
import { TrocaEmail } from "../entity/TrocaEmail"
import { SessionController } from "./SessionController"
import { Cifra } from "./Cifra"
import getFeed from "../feed"

export class ContaController {

    private userRepository = AppDataSource.getRepository(User) //Centralizar no userController??
    private acountValidator = new AcountValidatorController
    private trocaEmailController = new TrocaEmailController
    private sessionCtrl = new SessionController
    private cifrador = new Cifra

    async remTE(email : any){

        let te =  await this.trocaEmailController.one(email)

        return await this.trocaEmailController.remove(te)    
    }
    async admConta(request: Request, response: Response, next: NextFunction) {
        let usr = await this.userRepository.findOne({
            where: {
                email : request.session.email
            }
        })
        if(usr instanceof User){
            
            let user = await this.cifrador.decryptUser(usr)

            let feed  = getFeed();
            feed.then((feed)=>{
                response.render("conta.hbs", {usuario : user, user: user.firstName, login : request.session.login, atualizacao : false, rss : feed})
            })

        }else{
            response.render("errSolicitacao.hbs")
        }
    }

    async validarConta(user: User){
        user.valid = true

        let refreshUser = await this.cifrador.encryptUser(user)

        let result = await this.userRepository.update({ email: user.email }, refreshUser)
  
        if(result.affected == 1){

            return this.acountValidator.validarAccount(refreshUser)
        }
        return false
    }
    
    async efetiveAtualizacao(request: Request, response: Response, next: NextFunction) {
        let usr = await this.userRepository.findOne({
            where: {
                email : request.session.email
            }
        })
        
        let dcryptUser = await this.cifrador.decryptUser(usr)
             
        if(dcryptUser.atualizarEmail == false){
            dcryptUser.phone = request.body.phone
            dcryptUser.password = request.body.password

            let encryptUsr = await this.cifrador.encryptUser(dcryptUser)

            await this.userRepository.update({ email: request.session.email }, encryptUsr)

            response.redirect("/conta")      
                 
        }else{
            this.acountValidator.oneBySessionSecret(request).then((validador)=>{
                if(validador !== null){
                    if(!validador.newAcount){
                        this.trocaEmailController.one((validador.email)).then((trocaEmail)=>{
                            if(trocaEmail instanceof TrocaEmail){
                                this.userRepository.findOneBy({email: validador.email}).then((usr)=>{
                                    if(usr instanceof User){

                                        let decryptUser = this.cifrador.decryptUser(usr)
                                        decryptUser.then((user) => {
                                            
                                            let decryptTrocaEmail = this.cifrador.decryptTrocaEmail(trocaEmail)
                                            decryptTrocaEmail.then((te) =>{

                                                user.email = te.emailNovo
                                                user.phone = te.newPhone
                                                user.password = te.newPassword
                                                user.atualizarEmail = false
                                                request.session.email = te.emailNovo 
    
                                                let encryptUser = this.cifrador.encryptUser(user)
                                                encryptUser.then((saveUser) => {
                                                    this.userRepository.update({ email: validador.email }, saveUser)
                                                    this.acountValidator.remove(validador)
                                                    this.trocaEmailController.remove(trocaEmail)
                                                    this.sessionCtrl.sairSess(request)
                                                    response.render('atualizacaoSucess.hbs')
                                                })

                                            })

  

                                        })
  
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


        if(dados !== null && dados !== undefined){
           
            if(request.session.email == request.body.email){
              
                this.efetiveAtualizacao(request, response, next)
            }else{

                //Salvando um objeto do tipo TrocaEmail
                let trocaEmail = new TrocaEmail
                trocaEmail.emailAtual = request.session.email
                trocaEmail.emailNovo = request.body.email
                trocaEmail.newPhone = request.body.phone
                trocaEmail.newPassword = request.body.password

                let encryptTe = await this.cifrador.encryptTrocaEmail(trocaEmail)


                await this.trocaEmailController.save(encryptTe)

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