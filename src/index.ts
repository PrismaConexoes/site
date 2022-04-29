
import { AppDataSource } from "./data-source"
import { UserController } from "./controller/UserController"
import { Request, Response } from "express"

AppDataSource.initialize().then(async () => {

    //Configuração do express app
    const express = require('express')
    const app = express()

    //Configurar utilização de servidor seguro
    const sslRedirect = require('heroku-ssl-redirect').default; //Usar Default para não dar erro
    app.use(sslRedirect())

    //Configuração do body-parser
    const bp = require('body-parser')
    app.use(bp.json())
    app.use(bp.urlencoded({extended: true}))
    
    //Configuração do reCaptcha
    const captcha = require('express-recaptcha').RecaptchaV3
    const options = { 
        hl: 'pt',
        callback: testeF }
    const recaptcha = new captcha('6LciB7AfAAAAAMKT3Nlr-Ch2oCIWetsL58dMkCUC', '6LciB7AfAAAAAP2Z5z2iGzsk3nug44E3sJFjwRvC', options)

    function testeF(req, res){
        res.send(req.body)
    }  
    //Engine express-handlebars
    const exphbs  = require('express-handlebars');
    //Configuração do handlebars
    app.engine('hbs', exphbs.engine({extname: '.hbs'})); //configurando a extenção para .hbs invés de .handlebars
    app.set('view engine', 'hbs');                //Definindo handlebars como motor de visão do express

    //configurando o express para usar arquivos de pastas
    app.use(express.static(__dirname+'/public'));

    //Rotas
    //Rota Prisma
    app.get('/', (req, res) => {

        res.render("prisma.hbs")
    })

    //Rota F&F
    app.get('/fef', (req, res) => {

        res.render("fef.hbs")
    })

    //Rota DSOP
    app.get('/dsop', (req, res) => {

        res.render("dsop.hbs")
    })

    //Rota Futurum
    app.get('/futurum', (req, res) => {

        res.render("futurum.hbs")
    })

    //Rota Luz
    app.get('/luz', (req, res) => {

        res.render("luz.hbs")
    })

    //Rota MCI
    app.get('/mci', (req, res) => {

        res.render("mci.hbs")
    })

    //Rota F&F
    app.get('/next', (req, res) => {

        res.render("next.hbs")
    })


    
    //Rota Cadastrar
    app.get('/cadastrar', (req, res) => {

        res.render("cadastrar.hbs")
    })

    //Rota NewUser
    app.post('/newUser', (req: Request, res: Response , next: Function ) => {

        const controler = (new (UserController))
        const result = controler.save(req, res, next);

        if(result instanceof Promise){
            result.then(result => result !== null && result !== undefined ? res.send(result): undefined);
        }else if(result !== null && result !== undefined){
            res.json(result);
        }
        
    })

    //Rota Login
    app.get('/login', recaptcha.middleware.render,  (req: Request, res: Response , next: Function ) => {

        res.render("login.hbs", { captcha: res.recaptcha })
        
    })

    //Rota Entrar
    app.post('/entrar', (req: Request, res: Response , next: Function ) => {
        recaptcha.verify(req,  function (error, data) {
            if (!error) {
                const controler = (new (UserController))
                const result = controler.one(req, res, next);

                if(result instanceof Promise){
                    result.then(result => result !== null && result !== undefined ? res.send(result): res.send("Usuário não encontrado!"));
                }else if(result !== null && result !== undefined){
                    res.json(result);
                }
            } else {
                res.send("Erro de recaptcha")
            }
        })
        
    } )
        
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log('Servidor Http Online')});


    /** insert new users for test
    await AppDataSource.manager.save(
        AppDataSource.manager.create(Userr, {
            firstName: "Eduardo",
            lastName: "Proto",
            age: 27,
            email: "silvaproto@yahoo.com.br",
            password: "thururu"
        })
    )

   await AppDataSource.manager.save(
        AppDataSource.manager.create(Userr, {
            firstName: "Phantom",
            lastName: "Assassin",
            age: 24
        })
    )*/

    

}).catch(error => console.log(error))

