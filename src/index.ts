
import { AppDataSource } from "./data-source"
import { UserController } from "./controller/UserController"
import { PublicacaoController } from "./controller/PublicacaoController"
import { NextFunction, Request, Response } from "express"
import { Session } from "./entity/Session"
import { TypeormStore } from "connect-typeorm"
import { json } from "body-parser"


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

   
    //Configuração do reCaptcha
    const Recaptcha = require('express-recaptcha').RecaptchaV3
    const options = { 
        hl: 'pt',
        callback: gResponse
    }  
    const recaptcha = new Recaptcha('6LciB7AfAAAAAMKT3Nlr-Ch2oCIWetsL58dMkCUC', '6LciB7AfAAAAAP2Z5z2iGzsk3nug44E3sJFjwRvC', options)

    function gResponse(res){
        console.log(res)

    }
    //Configuração do body-parser
    const bp = require('body-parser')
    app.use(bp.json())
    app.use(bp.urlencoded({extended: true}))
    

    //Engine express-handlebars
    const exphbs  = require('express-handlebars');
    //Configuração do handlebars
    app.engine('hbs', exphbs.engine({extname: '.hbs'})); //configurando a extenção para .hbs invés de .handlebars
    app.set('view engine', 'hbs');                //Definindo handlebars como motor de visão do express

    //configurando o express para usar arquivos de pastas
    app.use(express.static(__dirname+'/public'));

    const userControler = new UserController
    
    //Rotas
    //Rota Prisma
    app.get('/', (req: Request, res: Response, next: NextFunction ) => {
       
         if(!req.session.login){
            req.session.user = ''
            req.session.login = false
        }
        if(!req.session.administrador){
            req.session.administrador = false
        }
        req.session.relogin = false 
        console.log(req.session)
        

        res.render("prisma.hbs" , {login: req.session.login, user: req.session.user, adm: req.session.administrador}) //implementar sessão e reconfigurar
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
            res.render("cadastrar.hbs", {captcha: recaptcha.render(), captchaErr : false})
        }       
    })



    //Rota Login
    app.get('/login',(req: Request, res: Response , next: Function ) => { // recaptcha.middleware.render,  (req: any, res: any , next: Function ) => {
        let login = req.session.login
        if(login == false){
            res.render("login.hbs", {captcha: recaptcha.render(), captchaErr : false, relogin: req.session.relogin}) //{ captcha: res.recaptcha, state: "" })
        }else{
            res.render("userLogadoErr", {user: req.session.user})
        }           
    })

    //Rota NewUser
    app.post('/newUser', (req: Request, res: Response, next: NextFunction ) => {
        recaptcha.verify(req, function (error, data) {
            if (!error) {
                userControler.save(req, res, next)
            } else {
                res.render('cadastrar.hbs', { captcha: recaptcha.render(), status : "Falha no captcha", captchaErr : true })
            }
        })        
    })

    //Rota Entrar
    app.post('/entrar', (req: any, res: any , next: NextFunction ) => {
        recaptcha.verify(req, function (error, data) {
            if (!error) {
                userControler.logar(req, res, next, recaptcha)
            } else {
                req.session.relogin = false
                res.render("login.hbs", {captcha: recaptcha.render(), captchaErr : true, status: "Falha no captcha", relogin: false});
            }
        })
    });

    //Rota Desalogar    
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

    app.get('/atualizarSite', (req: any, res: any , next: NextFunction ) => {
        if(req.session.administrador == true){
            const controller = new PublicacaoController
            let publications = controller.all(req, res, next)
            res.render("atualizaSite.hbs", {publicacoes: publications})
        }
    })
    app.post('/newPublicacao', (req: any, res: any , next: NextFunction ) => {
        if(req.session.administrador == true){
            const controller = new PublicacaoController
            const result = controller.save(req, res, next);
            if(result instanceof Promise){
                result.then((result) => {
                    if(result !== null && result !== undefined){
                        //Mensagem de sucesso
                    }else{
                        //Mensagem de erro( possível existencia de publicação com
                                            //mesmo título e empresa)
                    }
                });
            }else{
                //Mensagem de erro ao conectar com BD
            }

        }
    })
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log('Servidor Http Online')});
   

}).catch(error => console.log(error))



