

export class EmailController {

    private nodemailer = require('nodemailer');

    async enviar(htmlMessage: String, subject: String, receiver: String ){

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
        
        let email = {
            from: 'testeprisma503@gmail.com',
            to: receiver,
            subject: subject,
            html: htmlMessage
        };
        
        mailTransporter.sendMail(email, await function(err, data) {
            if(err) {
                console.log("erro: "+ err);
            } else {
                console.log('data'+data);
            }
        });
    }  
}