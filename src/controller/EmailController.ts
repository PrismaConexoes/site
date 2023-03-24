

import email from "../email"

export class EmailController {

    private nodemailer = require('nodemailer');

    async enviar(userEmail: string, secret: string, newAcount: boolean){

      /*  let mailTransporter = this.nodemailer.createTransport({

            host: 'smtp.mail.yahoo.com',
            port: 465,
            service:'yahoo',
            secure: true,
            auth: {
               user: 'silvaproto@yahoo.com.br',
               pass: 'uqomckcujuibfpzk'
            },
            debug: false,
            logger: true ,
            tls: {
                rejectUnauthorized: false,
            }
        });*/

        let mailTransport = this.nodemailer.createTransport({  
            service: 'Godaddy',  
            host: "smtpout.secureserver.net",  
            secure: true,
            secureConnection: false, // TLS requires secureConnection to be false
            tls: {
                ciphers:'SSLv3'
            },
            requireTLS:true,
            port: 465,
            debug: true,
            auth: {
                user: "sou@prismaconexoes.com",
                pass: "PrismaCNL" 
            }
        });

        let msg = 'atualização'
        if(newAcount){ msg = 'cadastro'}
        let link = 'https://prismaconexoes.com/validarUsuario/'+secret+'/'+newAcount
        
        let htmlMessage = email(link, msg)
        
        let sendEmail = {
            from: 'sou@prismaconexoes.com',
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