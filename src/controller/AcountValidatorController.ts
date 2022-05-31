import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { AcountValidator } from "../entity/AcountValidator"
import { Userr } from "../entity/Userr"
import { EmailController } from "../controller/EmailController"


export class AcountValidatorController {

    private validatorRepository = AppDataSource.getRepository(AcountValidator)
    private emailController = new EmailController

    async one(request: Request) {
        let result = this.validatorRepository.findOne({
            where: {
                parameter : request.params.secret
            }
        })
        if(result !== null && result !== undefined){
                return result
            }
        return null    
    }

    async updateAccount(user: Userr){
        user.valid = true
        console.log("user-valid: "+user.valid)
        let validator = await this.validatorRepository.findOneBy({ email : user.email });
        let result = await this.validatorRepository.remove(validator)
        console.log("result: "+result)
        return result
    }

    async saveSecret(user: Userr, secret: string, response: Response){
        let previous = await this.validatorRepository.findOne({
            where:{
                email: user.email,
            }              
        })
        if(previous == null){
            let entry = {email: user.email, parameter: secret, data: new Date()}
            let result = await this.validatorRepository.save(entry)

            let link = 'https://appprisma.herokuapp.com/validarUsuario/'+secret

            //Elaborar uma menssagem melhor
            let htmlMessage = '<div>Prezado cliente, recebemos o seu pedido de cadastramento em nossa plataforma. Pedimos que acesse o link a seguir para concluir o seu cadastro.</div><div><a href="'+link+'">Validar Cadastro</a></div>';
            this.emailController.enviar(htmlMessage, "Cadastro na plataforma Prisma Conexão", user.email)

            if(result !== null && result !== undefined){
               
                response.render("validarConta.hbs", {nome : user.firstName})
                
            }else{
                console.log("Ocorreu um erro ao salvar a validação no banco")
            }
        }else{
            console.log("O seguinte dado de validação está no banco: "+previous )
        }
    } 
}