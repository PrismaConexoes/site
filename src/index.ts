/////////////////////////////////////IMPORTS///////////////////////////////////////
import { AppDataSource } from "./data-source"
import { UserController } from "./controller/UserController"
import { PublicacaoController } from "./controller/PublicacaoController"
import { AcountValidatorController } from "./controller/AcountValidatorController"
import { SessionController } from "./controller/SessionController"
import { ContaController } from "./controller/ContaController"
import { NextFunction, Request, Response } from "express"
import { Session } from "./entity/Session"
import { Userr } from "./entity/Userr"
import { TypeormStore } from "connect-typeorm"
import { AcountValidator } from "./entity/AcountValidator"
import { EmailController } from "./controller/EmailController"
///////////////////////////////////////////////////////////////////////////////////



AppDataSource.initialize().then(async () => {


    /////////////IMPORTS///////////////
    const express = require('express')
    const app = express()
    const request = require('request')
    ///////////////////////////////////

    
    ////////////////////////SSL-HEROKU//////////////////////////
    const sslRedirect = require('heroku-ssl-redirect').default; 
    app.use(sslRedirect())
    ///////////////////////////////////////////////////////////

  
    /////////////////////EXPRESS-SESSION//////////////////////////
    let sessionRepository = AppDataSource.getRepository(Session)
    const session = require('express-session')
    app.use(
        session({
            resave: false,
            saveUnitialize: true,
            cookie: {
                path: '/', 
                httpOnly: true, 
                sameSite: true, 
                secure:'auto' , 
                maxAge: 86400000 }, 
            unset: 'destroy', 
            secret: "53Cr3TTp1RI5waApPiNh3r0cKu",
            store: new TypeormStore({
                cleanupLimit: 2,
                limitSubquery: false,
                onError: (s: TypeormStore, e: Error) => console.log(e),
                ttl: 8640000
              }).connect(sessionRepository)
        }));
    //////////////////////////////////////////////////////////////////


    ///////////////////GOOGLE-RECAPTCHA////////////////////////
    const Recaptcha = require('express-recaptcha').RecaptchaV3
    const options = { 
        hl: 'pt',
        callback: gResponse
    }  
    const recaptcha = new Recaptcha(
        '6LciB7AfAAAAAMKT3Nlr-Ch2oCIWetsL58dMkCUC', 
        '6LciB7AfAAAAAP2Z5z2iGzsk3nug44E3sJFjwRvC', 
        options)

    function gResponse(res){ console.log(res) }
    //////////////////////////////////////////////////////////

   
    /////////////BODY-PARSER////////////////
    const bp = require('body-parser')
    app.use(bp.json())
    app.use(bp.urlencoded({extended: true}))
    ////////////////////////////////////////

    ////////////////////HANDLEBARS////////////////////
    const exphbs  = require('express-handlebars');
    app.engine('hbs', exphbs.engine({extname: '.hbs'})); 
    app.set('view engine', 'hbs');                
    //////////////////////////////////////////////////

    /////////////ARQUIVOS ESTÁTICOS//////////////
    app.use(express.static(__dirname+'/public'));
    /////////////////////////////////////////////

    /////////////////////////CONTROLADORES/////////////////////////////
    const userControler = new UserController
    const publicacaoController = new PublicacaoController
    const acountValidatorController = new AcountValidatorController
    const sessionController = new SessionController
    const contaController = new ContaController
    const emailController = new EmailController
    //////////////////////////////////////////////////////////////////
   
    
    /////////////////////////////////////////////////////////////////////////
    //////////////////////////ROTAS DE NAVEGAÇÃO/////////////////////////////
    /////////////////////////////////////////////////////////////////////////

    //Rota Prisma
    app.get('/', (req: Request, res: Response, next: NextFunction ) => {
       
        sessionController.prismaSess(req)
        console.log(req.session)
        let carrossel = publicacaoController.allPrisma()
    
        if(carrossel instanceof Promise){
            carrossel.then((car)=>{
                let car1 = car[0]
                delete car[0]
                res.render("prisma.hbs" , {
                    login: req.session.login, 
                    user: req.session.user, 
                    adm: req.session.administrador,
                    ativo: car1,
                    carousel: car}) 
            })
        }
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

    //Rota Sair    
    app.get('/sair', (req: Request, res: Response , next: NextFunction ) => {
        sessionController.sairSess(req)
        res.redirect('/')
    } )
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////ROTAS RELACIONADAS A CONTAS//////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////// 

    //Rota Login
    app.get('/login',(req: Request, res: Response , next: Function ) => { 
        let login = req.session.login
        if(login == false){
            res.render("login.hbs", {captcha: recaptcha.render(), captchaErr : false, relogin: req.session.relogin}) 
        }else{
            res.render("userLogadoErr", {user: req.session.user})
        }           
    })

    //Rota Entrar
    app.post('/entrar', (req: any, res: any , next: NextFunction ) => {
        recaptcha.verify(req, function (error, data) {
            if (!error) {
                let result = userControler.one(req)
                result.then((user)=>{
                    if(user instanceof Userr){
                        sessionController.logar(req, res, next, recaptcha, user)
                    }else{
                        sessionController.loginSess(req, null, true)
                        res.render("login.hbs", {captcha: recaptcha.render(), captchaErr : false, relogin: true});
                    }   
                })  
            } else {
                req.session.relogin = false
                res.render("login.hbs", {captcha: recaptcha.render(), captchaErr : true, status: "Falha no captcha", relogin: false});
            }
        })
    });


    //Rota Cadastrar
    app.get('/cadastrar', (req, res) => {

        sessionController.cadastrarSess(req)

        if(req.session.login == true){
            res.render("userLogadoErr", {user: req.session.user})
        }else{
            res.render("cadastrar.hbs", {captcha: recaptcha.render(), captchaErr : false})
        }       
    })

    //Rota NewUser
    app.post('/newUser', (req: Request, res: Response, next: NextFunction ) => {
        recaptcha.verify(req, function (error, data) {
            if (!error) {
                userControler.save(req, res, next, recaptcha)
            } else {
                res.render('cadastrar.hbs', { captcha: recaptcha.render(), status : "Falha no captcha", captchaErr : true })
            }
        })        
    })

    //Rotas Administrar Conta
    app.get('/conta', (req: any, res: any , next: NextFunction ) => {
        
        if(req.session.login == true){
           contaController.admConta(req, res, next)
        }else{
            res.redirect('/login')
        }
    })

    //Rota Atualizar Conta
    app.post('/atualizarConta', (req: any, res: any , next: NextFunction ) => {
        
        if(req.session.login == true){
           contaController.atualizarConta(req, res, next)
        }else{
            res.redirect('/login')
        }
    })

    //Rota para validação de conta
    app.get('/validarUsuario/:secret',  (req: any, res: any , next: NextFunction ) => {

        //remover validadores expirados juntamente com os respectivos cadastros aqui(implementar função no controlador)
        //usar getTime() diff 3,6 x10^6 

        let validador = acountValidatorController.one(req)
        
        validador.then((validador)=>{
            if(validador !== null){
                console.log("validador_email: "+validador.email)
                sessionController.validatingSess(req, validador.email, validador.newAcount) //ver necessidade do newAcount   
                res.render("validarSecret.hbs", {captcha : recaptcha.render()}) 
            }else{
                res.redirect('/sair')
            }
        })
    })


    //Rota complementar para validação de conta
    app.post('/validarSecret',  (req: any, res: any , next: NextFunction ) => {
        recaptcha.verify(req, function (error, data) {
            if (!error) {
                let senha = req.body.password

                let usuario = userControler.oneBySession(req)

                usuario.then((user)=>{
                if(user.atualizarEmail){
                    contaController.efetiveAtualizacao(req, res, next)
                }
                else if(req.session.validating){
                    if(senha == user.password){
                        console.log("user: "+user.password)
                        contaController.validarConta(user).then((result)=>{
                            if(result){
                                sessionController.validatingEndSess(req)
                                res.render('cadastroValidado.hbs')
                            }
                        }) 
                    } 
                }
            })
            } else {
                res.redirect('/sair')
            }
        })})
    
    app.post('/removerConta', (req: any, res: any , next: NextFunction ) => {
        if(req.session.login == true){
            let remove = userControler.removeUser(req, res, next)
            if(remove){
                //Construir página de sucesso
                res.redirect('/sair')
            }else{
                res.send("Usuário não removido")//CRIAR MENSAGEM
            }
         }else{
             res.redirect('/sair')
         }
    })

    app.get('/reenviarEmail', (req, res, next) => {

        //Remover tokens vencidos aqui
        let validador = acountValidatorController.oneByEmail(req)
        validador.then((token)=>{
            if(token instanceof AcountValidator){
                console.log("email: "+req.session.email)
                sessionController.validatingSess(req, token.email, false)
                console.log("email: "+req.session.email)
                console.log("body: "+JSON.stringify(req.body))
                console.log("validador:"+JSON.stringify(token))
                emailController.enviar(token.email, token.parameter, token.newAcount)
            }
        }).then(()=>{
            res.render("avisoDeChecagem.hbs")
        })
    })
    
    ///////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////////////
    ///////////////////ROTAS RELACIONADAS A ADMINISTRAÇÃO DO SITE///////////////////
    ////////////////////////////////////////////////////////////////////////////////

    //Página Pricipal de atualização
    app.get('/atualizarSite', (req: any, res: any , next: NextFunction ) => {
        if(req.session.administrador == true){    
            publicacaoController.all(req, res, next)
        }else{
            res.redirect('/')
        }
    })

    //Salvar nova publicação
    app.post('/newPublicacao', (req: any, res: any , next: NextFunction ) => {
        if(req.session.administrador == true){
           publicacaoController.save(req, res, next);
        }else{
            res.redirect('/')
        }
    })

    //Deletar publicação
    app.post('/removePublicacao', (req: any, res: any , next: NextFunction ) => {
        console.log(req.body)
        if(req.session.administrador == true){
           publicacaoController.remove(req, res, next);
        }else{
            res.redirect('/')
        }
    })

    //Rota de créditos
    app.get('/copyrights', (req: Request, res: Response , next: NextFunction ) => {
        res.render("copyrights.hbs")
    })
    
    ///////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////


    ////////////////UP SERVICE///////////////////
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log('Servidor Http Online')});
    /////////////////////////////////////////////
   
}).catch(error => console.log(error))



