import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { Publicacao } from "../entity/Publicacao"

export class PublicacaoController {

    private publicacaoRepository = AppDataSource.getRepository(Publicacao)

    async all(request: Request, response: Response, next: NextFunction) {
        const result = this.publicacaoRepository.find()
        if(result instanceof Promise){
            result.then((result) => {
                if(result !== null && result !== undefined){
                    response.render("atualizaSite.hbs", {publicacoes: result})
                }else{
                    response.render("atualizaSite.hbs", {publicacoes: null})
                }
            });
        }else{
            response.render("atualizaSite.hbs", {publicacoes: null})
        }        
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
            const result = this.publicacaoRepository.save(request.body)
            if(result instanceof Promise){
                result.then((result) => {
                    if(result !== null && result !== undefined){
                       
                        response.render('sucessoPublicacao.hbs')
                    }else{
                        response.render('publicacaoErr.hbs', {status: "Ocorreu um erro"})
                    }
                });
            }else{
                response.render('publicacaoErr.hbs', {status: "Ocorreu um erro"})
            }

        }
        response.render('publicacaoErr.hbs', {status : "Já existe uma publicação para esta empresa com o mesmo título"})   
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