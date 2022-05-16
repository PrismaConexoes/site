import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { Userr } from "../entity/Userr"

export class UserController {

    private userRepository = AppDataSource.getRepository(Userr)

    /**async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find()
    }*/

    async one(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.findOne({
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
                    if(result !== null){
                        response.render("successCadastro.hbs", {user : result.firstName +" "+ result.lastName})
                    }else{
                        response.send("Não foi Possível salvar usuário."); //criar tela para este erro
                    }
                })
            }else{
                response.send("Não foi Possível salvar usuário."); //criar tela para este erro 
            } 
        }else{
            response.render("userCadastrarErr.hbs", {email: request.body.email})
        }
  
    }

    /** Implementar remoção de conta
    async remove(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.userRepository.findOneBy({ email: request.body.email })
        await this.userRepository.remove(userToRemove)
    }*/

}