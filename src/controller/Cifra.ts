import { User } from "../entity/User"
import { TrocaEmail } from "../entity/TrocaEmail";
import { FaleConosco } from "../entity/FaleConosco";
import { Contato } from "../entity/Contato";
import { Adm } from "../entity/Adm";

export class Cifra {
   
    private CryptoJS = require("crypto-js");

    async encryptUser(user : User) {

        let nome    =   this.CryptoJS.AES.encrypt(user.firstName , process.env.K_U_NOME).toString();
        let sobre   =   this.CryptoJS.AES.encrypt(user.lastName , process.env.K_U_SOBRE).toString(); 
        let tel     =   this.CryptoJS.AES.encrypt(user.phone , process.env.K_U_TEL).toString();
        let gender  =   this.CryptoJS.AES.encrypt(user.gender , process.env.K_U_GENDER).toString();
        let pass    =   this.CryptoJS.AES.encrypt(user.password , process.env.K_U_PASS).toString();
       
        user.firstName  = nome
        user.lastName   = sobre
        user.phone      = tel
        user.password   = pass
        user.gender     = gender
    
        return user
    }
    async decryptUser(user : User) {

        let nome    =   this.CryptoJS.AES.decrypt(user.firstName , process.env.K_NOME).toString(this.CryptoJS.enc.Utf8);
        let sobre   =   this.CryptoJS.AES.decrypt(user.lastName , process.env.K_SOBRE).toString(this.CryptoJS.enc.Utf8); 
        let tel     =   this.CryptoJS.AES.decrypt(user.phone , process.env.K_TEL).toString(this.CryptoJS.enc.Utf8);
        let gender  =   this.CryptoJS.AES.decrypt(user.gender , process.env.K_GENDER).toString(this.CryptoJS.enc.Utf8);
        let pass    =   this.CryptoJS.AES.decrypt(user.password , process.env.K_PASS).toString(this.CryptoJS.enc.Utf8);
       
        user.firstName  = nome
        user.lastName   = sobre
        user.phone      = tel
        user.password   = pass
        user.gender     = gender

        return user
    }

    async encryptTrocaEmail(te : TrocaEmail) {

        let tel     =   this.CryptoJS.AES.encrypt(te.newPhone , process.env.K_TEL).toString();
        let pass    =   this.CryptoJS.AES.encrypt(te.newPassword , process.env.K_PASS).toString();
       
        te.newPhone      = tel
        te.newPassword   = pass
    
        return te
    }
    async decryptTrocaEmail(te : TrocaEmail) {
 
        let tel     =   this.CryptoJS.AES.decrypt(te.newPhone , process.env.K_TEL).toString(this.CryptoJS.enc.Utf8);
        let pass    =   this.CryptoJS.AES.decrypt(te.newPassword , process.env.K_PASS).toString(this.CryptoJS.enc.Utf8);
       
        te.newPhone      = tel
        te.newPassword   = pass

        return te
    }

    async encryptFaleConosco(fc : FaleConosco) {
   
        let sobre       =   this.CryptoJS.AES.encrypt(fc.sobrenome , process.env.K_SOBRE).toString(); 
        let tel         =   this.CryptoJS.AES.encrypt(fc.telefone , process.env.K_TEL).toString();
        let mensagem    =   this.CryptoJS.AES.encrypt(fc.mensagem , process.env.K_MENS).toString();
 
        fc.sobrenome    = sobre
        fc.telefone     = tel
        fc.mensagem     = mensagem
    
        return fc
    }
    async decryptFaleConosco(fc : FaleConosco) {
 
        let sobre       =   this.CryptoJS.AES.decrypt(fc.sobrenome , process.env.K_SOBRE).toString(this.CryptoJS.enc.Utf8); 
        let tel         =   this.CryptoJS.AES.decrypt(fc.telefone , process.env.K_TEL).toString(this.CryptoJS.enc.Utf8);
        let mensagem     =   this.CryptoJS.AES.decrypt(fc.mensagem , process.env.K_MENS).toString(this.CryptoJS.enc.Utf8);

        fc.sobrenome    = sobre
        fc.telefone     = tel
        fc.mensagem     = mensagem

        return fc
    }

    async encryptContato(contato : Contato) {

        let mail        =   this.CryptoJS.AES.encrypt(contato.email , process.env.K_EMAIL).toString();
        let assunto     =   this.CryptoJS.AES.encrypt(contato.assunto , process.env.K_ASS).toString();
        let mensagem    =   this.CryptoJS.AES.encrypt(contato.mensagem , process.env.K_MENS).toString();

        contato.email       = mail
        contato.assunto     = assunto
        contato.mensagem    = mensagem
        
        return contato
    }
    async decryptContato(contato : Contato) {
 
        let mail        =   this.CryptoJS.AES.decrypt(contato.email , process.env.K_EMAIL).toString(this.CryptoJS.enc.Utf8); 
        let assunto     =   this.CryptoJS.AES.decrypt(contato.assunto , process.env.K_ASS).toString(this.CryptoJS.enc.Utf8); 
        let mensagem    =   this.CryptoJS.AES.decrypt(contato.mensagem , process.env.K_MENS).toString(this.CryptoJS.enc.Utf8); 
        
        contato.email       = mail
        contato.assunto     = assunto
        contato.mensagem    = mensagem

        return contato
    }

    async encryptAdm(adm : Adm) {

        let mail        =   this.CryptoJS.AES.encrypt(adm.email , process.env.K_POW).toString();
        adm.email       = mail
        
        return adm
    }
    async decryptAdm(adm : Adm) {
 
        let mail        =   this.CryptoJS.AES.decrypt(adm.email , process.env.K_POW).toString(this.CryptoJS.enc.Utf8); 
        adm.email       = mail
        
        return adm
    }
}