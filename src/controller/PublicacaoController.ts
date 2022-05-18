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
        return this.publicacaoRepository.findOne({
            where: {
                titulo : request.body.titulo,
                empresa: request.body.empresa
            }
        })
    }

    async save(request: Request, response: Response, next: NextFunction) {
        let result = this.publicacaoRepository.findOne({
            where: {
                titulo : request.body.titulo,
                empresa: request.body.empresa
            }
        })
        if(result instanceof Promise){
            result.then((result) => {
                if(result !== null && result !== undefined){
                    const res = this.publicacaoRepository.save(request.body)
                    if(res instanceof Promise){
                        res.then((res) => {
                            if(res !== null && res !== undefined){
                                response.render('sucessoPublicacao.hbs')
                            }else{
                                response.render('publicacaoErr.hbs', {status: "Ocorreu um erro"})
                            }
                        });
                    }else{
                        response.render('publicacaoErr.hbs', {status: "Ocorreu um erro"})
                    }
                }else{
                    response.render('publicacaoErr.hbs', {status: "Ocorreu um erro"})
                }
            });
        }else{
            response.render('publicacaoErr.hbs', {status: "Ocorreu um erro"})
        }      
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let result = this.publicacaoRepository.findOne({
            where: {
                titulo : request.body.titulo,
                empresa: request.body.empresa
            }
        })
        if(result instanceof Promise){
            result.then((result) => {
                if(result !== null && result !== undefined){
                    let res = this.publicacaoRepository.remove(result)
                    if(res instanceof Promise){
                        res.then((res) => {
                            if(res !== null && res !== undefined){
                                response.render('sucessoPublicacaoRemovida.hbs')
                            }else{
                                response.render('publicacaoRemovidaErr.hbs', {status: "Ocorreu um erro"})
                            }
                        });
                    }else{
                        response.render('publicacaoRemovidaErr.hbs', {status: "Ocorreu um erro"})
                    }
                }else{
                    response.render('publicacaoRemovidaErr.hbs', {status: "Ocorreu um erro"})
                }
            });
        }else{
            response.render('publicacaoRemovidaErr.hbs', {status: "Ocorreu um erro"})
        }
    }    
}   
