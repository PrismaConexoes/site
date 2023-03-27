import { Userr } from "../entity/Userr"
import { TrocaEmail } from "../entity/TrocaEmail";
import { FaleConosco } from "../entity/FaleConosco";
import { Contato } from "../entity/Contato";
import { Adm } from "../entity/Adm";

export class Cifra {
   
    private CryptoJS = require("crypto-js");

    async encryptUser(user : Userr) {

        let nome    =   this.CryptoJS.AES.encrypt(user.firstName , 'NomE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString();
        let sobre   =   this.CryptoJS.AES.encrypt(user.lastName , 'SobrE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(); 
        let tel     =   this.CryptoJS.AES.encrypt(user.phone , 'PhonE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString();
        //Mudar para hash SHA256 ???
        let pass    =   this.CryptoJS.AES.encrypt(user.password , 'PassworD53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString();
       
        user.firstName  = nome
        user.lastName   = sobre
        user.phone      = tel
        user.password   = pass
    
        return user
    }
    async decryptUser(user : Userr) {

        let nome    =   this.CryptoJS.AES.decrypt(user.firstName , 'NomE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(this.CryptoJS.enc.Utf8);
        let sobre   =   this.CryptoJS.AES.decrypt(user.lastName , 'SobrE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(this.CryptoJS.enc.Utf8); 
        let tel     =   this.CryptoJS.AES.decrypt(user.phone , 'PhonE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(this.CryptoJS.enc.Utf8);
        let pass    =   this.CryptoJS.AES.decrypt(user.password , 'PassworD53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(this.CryptoJS.enc.Utf8);
       
        user.firstName  = nome
        user.lastName   = sobre
        user.phone      = tel
        user.password   = pass

        return user
    }

    async encryptTrocaEmail(te : TrocaEmail) {

        let tel     =   this.CryptoJS.AES.encrypt(te.newPhone , 'PhonE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString();
        let pass    =   this.CryptoJS.AES.encrypt(te.newPassword , 'PassworD53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString();
       
        te.newPhone      = tel
        te.newPassword   = pass
    
        return te
    }
    async decryptTrocaEmail(te : TrocaEmail) {
 
        let tel     =   this.CryptoJS.AES.decrypt(te.newPhone , 'PhonE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(this.CryptoJS.enc.Utf8);
        let pass    =   this.CryptoJS.AES.decrypt(te.newPassword , 'PassworD53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(this.CryptoJS.enc.Utf8);
       
        te.newPhone      = tel
        te.newPassword   = pass

        return te
    }

    async encryptFaleConosco(fc : FaleConosco) {
   
        let sobre       =   this.CryptoJS.AES.encrypt(fc.sobrenome , 'SobrE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(); 
        let tel         =   this.CryptoJS.AES.encrypt(fc.telefone , 'PhonE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString();
        let mensagem    =   this.CryptoJS.AES.encrypt(fc.mensagem , 'MeNSagEm53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString();
 
        fc.sobrenome    = sobre
        fc.telefone     = tel
        fc.mensagem     = mensagem
    
        return fc
    }
    async decryptFaleConosco(fc : FaleConosco) {
 
        let sobre       =   this.CryptoJS.AES.decrypt(fc.sobrenome , 'SobrE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(this.CryptoJS.enc.Utf8); 
        let tel         =   this.CryptoJS.AES.decrypt(fc.telefone , 'PhonE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(this.CryptoJS.enc.Utf8);
        let mensagem     =   this.CryptoJS.AES.decrypt(fc.mensagem , 'MeNSagEm53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(this.CryptoJS.enc.Utf8);

        fc.sobrenome    = sobre
        fc.telefone     = tel
        fc.mensagem     = mensagem

        return fc
    }

    async encryptContato(contato : Contato) {

        let mail        =   this.CryptoJS.AES.encrypt(contato.email , 'EmaiL53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString();
        let assunto     =   this.CryptoJS.AES.encrypt(contato.assunto , 'AssUnTo53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString();
        let mensagem    =   this.CryptoJS.AES.encrypt(contato.mensagem , 'MeNSagEm53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString();

        contato.email       = mail
        contato.assunto     = assunto
        contato.mensagem    = mensagem
        
        return contato
    }
    async decryptContato(contato : Contato) {
 
        let mail        =   this.CryptoJS.AES.decrypt(contato.email , 'EmaiL53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(this.CryptoJS.enc.Utf8); 
        let assunto     =   this.CryptoJS.AES.decrypt(contato.assunto , 'AssUnTo53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(this.CryptoJS.enc.Utf8); 
        let mensagem    =   this.CryptoJS.AES.decrypt(contato.mensagem , 'MeNSagEm53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(this.CryptoJS.enc.Utf8); 
        
        contato.email       = mail
        contato.assunto     = assunto
        contato.mensagem    = mensagem

        return contato
    }

    async encryptAdm(adm : Adm) {

        let mail        =   this.CryptoJS.AES.encrypt(adm.email , 'ADMEmaiL53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7izzZZZjfh&%$35465Tttrrxasd').toString();
        adm.email       = mail
        
        return adm
    }
    async decryptAdm(adm : Adm) {
 
        let mail        =   this.CryptoJS.AES.decrypt(adm.email , 'ADMEmaiL53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7izzZZZjfh&%$35465Tttrrxasd').toString(this.CryptoJS.enc.Utf8); 
        adm.email       = mail
        
        return adm
    }
}