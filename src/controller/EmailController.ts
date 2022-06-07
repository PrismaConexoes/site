

import email from "../email"

export class EmailController {

    private nodemailer = require('nodemailer');

    async enviar(userEmail: string, secret: string, newAcount: boolean){

        let mailTransporter = this.nodemailer.createTransport({
            //Obs:Advinhação => Mascarar é CrImE. Autorizar junto ao serviço de email o envio por aplicativos apenas com usuário e senha
            //Ver política do google que previa mudança para 30/05/22
            service: 'gmail',
            auth: {
                user: 'testeprisma503@gmail.com',
                pass: 'tE$t3prisma'
            },
            tls: {
                rejectUnauthorized: false,
            }
        });

        let msg = 'atualização'
        if(newAcount){ msg = 'cadastro'}
        let link = 'https://appprisma.herokuapp.com/validarUsuario/'+secret+'/'+newAcount
        
        let htmlMessage = email(link, msg)
        
        let sendEmail = {
            from: 'testeprisma503@gmail.com',
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
                //null Não é necessária nenhuma ação  porque em caso de erro o usuário tem a opção de reenviar o email  
        });
    }  
}