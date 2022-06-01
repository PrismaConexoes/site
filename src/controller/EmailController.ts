
import email from "../email"

export class EmailController {

    private nodemailer = require('nodemailer');

    async enviar(userEmail: string, secret: string){

        let mailTransporter = this.nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'testeprisma503@gmail.com',
                pass: 'tE$t3prisma'
            },
            tls: {
                rejectUnauthorized: false,
            }
        });

        
        let link = 'https://appprisma.herokuapp.com/validarUsuario/'+secret
   
        let htmlMessage = email(link)
        
        let sendEmail = {
            from: 'testeprisma503@gmail.com',
            to: userEmail,
            subject: "Cadastro Prisma Conexão",
            html: htmlMessage
        };
        
        mailTransporter.sendMail(sendEmail, await function(err, data) {
            if(err) {
                console.log("erro: "+ err);
            } else {
                console.log('data'+data);
            }
        });
    }  
}