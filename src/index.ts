
import { AppDataSource } from "./data-source"
import { UserController } from "./controller/UserController"
import { NextFunction, Request, Response } from "express"
import { Session } from "./entity/Session"
import { TypeormStore } from "connect-typeorm"
import { json } from "body-parser"
import { Repository } from "typeorm"

AppDataSource.initialize().then(async () => {

    const request = require('request')

    //Configuração do express app
    const express = require('express')
    const app = express()

    //app.set('trust proxy', 1) //Ver se essa configuração não está dando erro no Elephant SQL
   
    //Configurar utilização de servidor seguro
    const sslRedirect = require('heroku-ssl-redirect').default; //Usar Default para não dar erro
    app.use(sslRedirect())

    //Configurações da sessao
    let sessionRepository = AppDataSource.getRepository(Session)
    const session = require('express-session')
    
    app.use(
        session({
            resave: false,
            saveUnitialize: true,
            cookie: {path: '/', httpOnly: true, sameSite: true, secure:'auto' , maxAge: 86400000 }, //configurações do cookie pasta, acessibilidade no documumento e utilização de https
            unset: 'destroy', //será apagada quando encerrada a sessao
            secret: "53Cr3TTp1RI5waApPiNh3r0cKu", // implementar Keygrip
            store: new TypeormStore({
                cleanupLimit: 2,
                limitSubquery: false, // If using MariaDB.
                onError: (s: TypeormStore, e: Error) => console.log(e),
                ttl: 8640000
              }).connect(sessionRepository)
        })
    )

   


    //Configuração do body-parser
    const bp = require('body-parser')
    app.use(bp.json())
    app.use(bp.urlencoded({extended: true}))
    
    //Configuração do reCaptcha
    const captcha = require('express-recaptcha').RecaptchaV3
    const options = { 
        hl: 'pt',
        callback: testeF //Ver mais sobre a função de callback neste caso 
    }  
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

    let adms = require(__dirname+'/public/adm.json');
    //let adms =  express.static(__dirname+'/public/adm.json');
    //Rotas
    //Rota Prisma
    app.get('/', (req: Request, res: Response, next: NextFunction ) => {
         if(!req.session.login){
            req.session.user = ''
            req.session.login = false
        }
        req.session.relogin = false 
        console.log(req.session)
        

        res.render("prisma.hbs" , {login: req.session.login, user: req.session.user}) //implementar sessão e reconfigurar
    })

    //Rota F&F
    app.get('/fef', (req, res) => {

        res.render("fef.hbs", {login: req.session.login, user: req.session.user})
    })

    //Rota DSOP
    app.get('/dsop', (req, res) => {

        res.render("dsop.hbs", {login: req.session.login, user: req.session.user})
    })

    //Rota Futurum
    app.get('/futurum', (req, res) => {

        res.render("futurum.hbs", {login: req.session.login, user: req.session.user})
    })

    //Rota Luz
    app.get('/luz', (req, res) => {

        res.render("luz.hbs", {login: req.session.login, user: req.session.user})
    })

    //Rota MCI
    app.get('/mci', (req, res) => {

        res.render("mci.hbs", {login: req.session.login, user: req.session.user})
    })

    //Rota F&F
    app.get('/next', (req, res) => {

        res.render("next.hbs", {login: req.session.login, user: req.session.user})
    })
    
    //Rota Cadastrar
    app.get('/cadastrar', (req, res) => {
        req.session.relogin = false 
        if(!req.session.login){
            req.session.user = ''
            req.session.login = false
        }
        if(req.session.login == true){
            res.render("userLogadoErr", {user: req.session.user})
        }else{
            res.render("cadastrar.hbs")
        }       
    })

    //Rota NewUser
    app.post('/newUser', (req: Request, res: Response, next: NextFunction ) => {

        const controler = new UserController
        const result = controler.save(req, res, next);

        if(result instanceof Promise){
            result.then((result) => {
                if(result !== null && result !== undefined){
                    res.render("successCadastro.hbs", {user : result.firstName +" "+ result.lastName})
                }else{
                    res.render("userCadastrarErr.hbs", {email: req.body.email})
                } 
            })
        }else if(result !== null && result !== undefined){
            res.json(result);
        }       
    })

    //Rota Login
    app.get('/login',(req: Request, res: Response , next: Function ) => { // recaptcha.middleware.render,  (req: any, res: any , next: Function ) => {
        let login = req.session.login
        if(login == false){
            res.render("login.hbs", {relogin: req.session.relogin}) //{ captcha: res.recaptcha, state: "" })
        }else{
            res.render("userLogadoErr", {user: req.session.user})
        }           
    })

    //Rota Entrar
    app.post('/entrar', (req: any, res: any , next: NextFunction ) => {
        if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null)
        {
          return res.render("login.hbs", { captcha: res.recaptcha, state: "Erro de Captcha"});
        }
        const secretKey = "6LciB7AfAAAAAP2Z5z2iGzsk3nug44E3sJFjwRvC";
        console.log(recaptcha)
        console.log(recaptcha.middleware.render)
        const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
        
        request(verificationURL,function(error,response,body) { //Colocar esta verificação dentro da função de callback( construir uma classe para fornecer este serviço???)
          body = JSON.parse(body);
          if(body.success !== undefined && !body.success) {
            return res.render("login.hbs", { captcha: res.recaptcha, state: "Falha no captcha"});
          }



        req.session.relogin = false 
        
        


        const controler = (new (UserController))
        const result = controler.one(req, res, next);

        if(result instanceof Promise){
            result.then((result) => {
                if(result !== null && result !== undefined){
                    req.session.login = true
                    req.session.user =  result.firstName +" "+ result.lastName
                    req.session.email = result.email
                    if(req.session.email in adms){
                        req.session.administrador = true;
                    }
                    console.log(req.session);
                    res.redirect('/')
                 }else{
                    req.session.relogin = true
                    res.render("login.hbs", {relogin: true})
                 }
            }); 
        }else if(result !== null && result !== undefined){
            res.json(result);
        }
        });
    });
    app.get('/sair', (req: Request, res: Response , next: NextFunction ) => {
        req.session.login = false
        req.session.relogin = false
        req.session.user = ""
        req.session.email = ""
        res.redirect('/')
    } )
    
    app.get('/copyrights', (req: Request, res: Response , next: NextFunction ) => {
        res.render("copyrights.hbs")
    })

    app.post('/removeImage', (req: any, res: any , next: NextFunction ) => {
        if(req.sessin.administrador == true){

        }
    })

    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log('Servidor Http Online')});
   

}).catch(error => console.log(error))



