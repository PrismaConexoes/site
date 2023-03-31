import { AppDataSource } from "../data-source" 
import { Request } from "express"
import { Adm } from "../entity/Adm"
import { Cifra } from "./Cifra"

export class AdmController {

    private admsRepository = AppDataSource.getRepository(Adm)
    private cifrador = new Cifra

    async all() {
        let find_adms = await this.admsRepository.find()
        let adms_arr = []
       
        find_adms.forEach((adm) => {
            let decryptAdm = this.cifrador.decryptAdm(adm)
            decryptAdm.then((dcAdm)=> {
                adms_arr.push(dcAdm)
            })
        })
              
        return adms_arr
    }

    async oneForId(request: Request) {
        let adm = await this.admsRepository.findOne({
            where: {
                id : parseInt(request.params.id)
            }
        })

        if(adm instanceof Adm){
            return adm
        }else{
            return null
        }
    }
    async save(adm: Adm) {
        let encryptAdm = await this.cifrador.encryptAdm(adm)
        const result = await this.admsRepository.save(encryptAdm)
        if(result !== null && result !== undefined){
            return true
        }else{
            return false
        }
    }
    async removeAdm(adm : Adm) {

        let del_adm  = await this.admsRepository.remove(adm)

        if(del_adm instanceof Adm){
            return true
        }
        return false
    }
}