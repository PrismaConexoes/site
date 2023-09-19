

import email from "../email"

export class EmailController {

    private nodemailer = require('nodemailer');

    async enviar(userEmail: string, secret: string, newAcount: boolean){

        let msg = 'atualização'
        if(newAcount){ msg = 'cadastro'}
        let link = 'https://prismaconexoes.com/validarUsuario/'+secret+'/'+newAcount  
        let htmlMessage = email(link, msg)
        let provedor = userEmail.split('@')[1].toString()
        
        let nameC = null
        let serviceC = null
        let hostC = null
        let usuario = null
        let senha = null

 
        if(provedor === "gmail.com"){
            nameC = "Eduardo Proto"
            serviceC = 'yahoo'
            hostC = 'smtp.mail.yahoo.com'
            usuario = "silvaproto@yahoo.com.br"  
            senha = "qklmlcgkrginqnzq"
        }else{
            nameC = 'prismaconexoes.com'
            serviceC = 'Godaddy'
            hostC = "smtpout.secureserver.net"
            usuario = "souprisma@prismaconexoes.com" 
            senha = "PrismaCNL" 
        }

        let mailTransport = this.nodemailer.createTransport({ 
            name: nameC, 
            service: serviceC,  
            host: hostC,
            secureConnection: true,  
            tls: { rejectUnauthorized: false },
            port: 587,
            auth: {
                user: usuario,
                pass: senha
            },
            logger: true
        });
        
        let sendEmail = {
            from: usuario,
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