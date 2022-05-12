import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { Publicacao } from "../entity/Publicacao"

export class PublicacaoController {

    private publicacaoRepository = AppDataSource.getRepository(Publicacao)

    async all(request: Request, response: Response, next: NextFunction) {
        return await this.publicacaoRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return await this.publicacaoRepository.findOne({
            where: {
                titulo : request.body.titulo,
                empresa: request.body.empresa
            }
        })
    }

    async save(request: Request, response: Response, next: NextFunction) {
        let publicacao =  await this.publicacaoRepository.findOne({
            where: {
                titulo : request.body.titulo,
                empresa: request.body.empresa
            }
        })
        if(publicacao == null){
            return await this.publicacaoRepository.save(request.body)
        }
        return null     
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let publicacao =  await this.publicacaoRepository.findOne({
            where: {
                titulo : request.body.titulo,
                empresa: request.body.empresa
            }
        })
        if(publicacao == null){
            return null
        }
        await this.publicacaoRepository.remove(publicacao)
    }
}