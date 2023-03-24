

import email from "../email"

export class EmailController {

    private nodemailer = require('nodemailer');

    async enviar(userEmail: string, secret: string, newAcount: boolean){

        let mailTransporter = this.nodemailer.createTransport({

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
        });

        let msg = 'atualização'
        if(newAcount){ msg = 'cadastro'}
        let link = 'https://prismaconexoes.com/validarUsuario/'+secret+'/'+newAcount
        
        let htmlMessage = email(link, msg)
        
        let sendEmail = {
            from: 'silvaproto@yahoo.com.br',
            to: userEmail,
            subject: "Cadastro Prisma Conexão",
            html: htmlMessage
        };
        
        mailTransporter.sendMail(sendEmail, await function(err, data) {
            if(err){
                console.log("err: "+err)
            }else if(data){
                console.log("data: "+JSON.parse(data))
            } 
        });
    }  
}