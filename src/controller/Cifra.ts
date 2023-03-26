import { Userr } from "../entity/Userr"
import { TrocaEmail } from "../entity/TrocaEmail";
import { FaleConosco } from "../entity/FaleConosco";
import { Contato } from "../entity/Contato";

export class Cifra {
   
    private CryptoJS = require("crypto-js");

    async encryptUser(user : Userr) {

        let nome    =   this.CryptoJS.AES.encrypt(user.firstName , 'NomE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString();
        let sobre   =   this.CryptoJS.AES.encrypt(user.lastName , 'SobrE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(); 
        let tel     =   this.CryptoJS.AES.encrypt(user.phone , 'PhonE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString();
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

        let nome    =   this.CryptoJS.AES.encrypt(fc.nome , 'NomE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString();
        let sobre   =   this.CryptoJS.AES.encrypt(fc.sobrenome , 'SobrE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(); 
        let tel     =   this.CryptoJS.AES.encrypt(fc.telefone , 'PhonE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString();

        fc.nome         = nome
        fc.sobrenome    = sobre
        fc.telefone     = tel
    
        return fc
    }
    async decryptFaleConosco(fc : FaleConosco) {
 
        let nome    =   this.CryptoJS.AES.decrypt(fc.nome , 'NomE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(this.CryptoJS.enc.Utf8);
        let sobre   =   this.CryptoJS.AES.decrypt(fc.sobrenome , 'SobrE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(this.CryptoJS.enc.Utf8); 
        let tel     =   this.CryptoJS.AES.decrypt(fc.telefone , 'PhonE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(this.CryptoJS.enc.Utf8);

        fc.nome         = nome
        fc.sobrenome    = sobre
        fc.telefone     = tel

        return fc
    }

    async encryptContato(contato : Contato) {

        let nome    =   this.CryptoJS.AES.encrypt(contato.nome , 'NomE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString();
        let mail    =   this.CryptoJS.AES.encrypt(contato.email , 'EmaiL53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString();

        contato.nome    = nome
        contato.email   = mail
        
        return contato
    }
    async decryptContato(contato : Contato) {
 
        let nome    =   this.CryptoJS.AES.decrypt(contato.nome , 'NomE53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(this.CryptoJS.enc.Utf8);
        let mail    =   this.CryptoJS.AES.decrypt(contato.email , 'EmaiL53Cr3TTp1RI5waApPiNc0nT@yg33NcR1p7i').toString(this.CryptoJS.enc.Utf8); 

        contato.nome    = nome
        contato.email   = mail

        return contato
    }
}