

import email from "../email"

export class EmailController {

    private nodemailer = require('nodemailer');

    async enviar(userEmail: string, secret: string, newAcount: boolean){


        let mailTransport = this.nodemailer.createTransport({  
            service: 'Godaddy',  
            host: "smtpout.secureserver.net",
            secureConnection: true,  
            tls: { rejectUnauthorized: false },
            port: 465,
            auth: {
                user: "souprisma@prismaconexoes.com",
                pass: "PrismaCNL" 
            }
        });

        let msg = 'atualização'
        if(newAcount){ msg = 'cadastro'}
        
        let link = 'https://prismaconexoes.com/validarUsuario/'+secret+'/'+newAcount
        
        let htmlMessage = email(link, msg)
        
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