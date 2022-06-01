import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { Userr } from "../entity/Userr"
import { AcountValidatorController } from "./AcountValidatorController"

export class ContaController {

    private userRepository = AppDataSource.getRepository(Userr)
    private acountValidator = new AcountValidatorController

    async admConta(request: Request, response: Response, next: NextFunction) {
        let user = await this.userRepository.findOne({
            where: {
                email : request.session.email
            }
        })
        if(user instanceof Userr){
            response.render("conta.hbs", {usuario : user, user: user.firstName, login : request.session.login})
        }else{
            console.log("Ocorreu um erro ao recuperar o usuário no BD.") //criar page
        }
    }

    async validarConta(user: Userr){
        user.valid = true
        let result = await this.userRepository.update({ email: user.email }, user)
        console.log(result)  
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
}