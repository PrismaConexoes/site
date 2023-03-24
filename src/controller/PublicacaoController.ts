import { AppDataSource } from "../data-source" 
import { NextFunction, Request, Response } from "express"
import { Publicacao } from "../entity/Publicacao"



//REVER ESTA CLASSE



export class PublicacaoController {

    private publicacaoRepository = AppDataSource.getRepository(Publicacao)

    async all(request: Request, response: Response, next: NextFunction) {

        this.publicacaoRepository.find().then((result)=>{
            response.render("atualizaSite.hbs", {publicacoes: result})
        })
        
    }
   
    async allPrisma() {
        const result = await this.publicacaoRepository.findBy({
                empresa: "Prisma",
                campo: "carrossel"
        })
        return result    
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
        let result = await this.publicacaoRepository.findOne({
            where: {
                titulo : request.body.titulo,
                empresa: request.body.empresa
            }
        })
        if(result == null){
            const result1 = await this.publicacaoRepository.save(request.body)

            if(result1 !== null && result1 !== undefined){
                response.render('sucessoPublicacao.hbs')
            }else{
                response.render('publicacaoErr.hbs', {status: "Ocorreu um erro ao salvar a publicação"})
            }
    
        }else{
            response.render('publicacaoErr.hbs', {status: "Já existe uma publicação com este título para esta empresa."})
        }      
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let result = await this.publicacaoRepository.findOne({
            where: {
                titulo : request.body.titulo,
                empresa: request.body.empresa
            }
        })
        if(result !== null && result !== undefined){
            let result1 = await this.publicacaoRepository.remove(result)

            if(result1 !== null && result1 !== undefined){
                response.render('sucessoPublicacaoRemovida.hbs')
            }else{
                response.render('publicacaoErr.hbs', {status: "Ocorreu um erro ao remover publicação"})
            }

        }else{
            response.render('publicacaoErr.hbs', {status: "Ocorreu um erro ao remover publicação"})
        }
    }    
}   
