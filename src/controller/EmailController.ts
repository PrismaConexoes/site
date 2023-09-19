

import email from "../email"

export class EmailController {

    private nodemailer = require('nodemailer');

    async enviar(userEmail: string, secret: string, newAcount: boolean){

        let msg = 'atualização'
        if(newAcount){ msg = 'cadastro'}
        let link = 'https://prismaconexoes.com/validarUsuario/'+secret+'/'+newAcount  
        let htmlMessage = email(link, msg)
        let provedor = userEmail.split('@')[1].toString()
        
        let name = null
        let service = null
        let host = null
        let user = null
        let pass = null
 
        if(provedor === "gmail.com"){
            console.log("entrou na verificação gmail")
            console.log(provedor)
            console.log("...")

        }

        let mailTransport = this.nodemailer.createTransport({ 
            name: 'prismaconexoes.com', 
            service: 'Godaddy',  
            host: "smtpout.secureserver.net",
            secureConnection: true,  
            tls: { rejectUnauthorized: false },
            port: 587,
            auth: {
                user: "souprisma@prismaconexoes.com",
                pass: "PrismaCNL" 
            }
        });
        
        let sendEmail = {
            from: 'souprisma@prismaconexoes.com',
            to: userEmail,
            subject: "Cadastro Prisma Conexão",
            html: htmlMessage
        };
        
        mailTransport.sendMail(sendEmail, await function(err, data) {
            if(err){
                console.log("err: "+err)
            }else if(data){
                console.log("data: "+JSON.parse(data))
            } 
        });
    }  
}