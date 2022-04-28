import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { Userr } from "../entity/Userr"

export class UserController {

    private userRepository = AppDataSource.getRepository(Userr)

    /**async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find()
    }*/

    async one(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.findOne(request.body.email)
    }

    async save(request: Request, response: Response, next: NextFunction) {
        //Implementar verificação de existência de usuário
        return this.userRepository.save(request.body)
    }

    /** Implementar remoção de conta
    async remove(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.userRepository.findOneBy({ email: request.body.email })
        await this.userRepository.remove(userToRemove)
    }*/

}