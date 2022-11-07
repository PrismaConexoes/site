/////////////////////////////////////IMPORTS///////////////////////////////////////
import { AppDataSource } from "./data-source"
import { UserController } from "./controller/UserController"
import { PublicacaoController } from "./controller/PublicacaoController"
import { FaleConoscoController } from "./controller/FaleConoscoController"
import { AcountValidatorController } from "./controller/AcountValidatorController"
import { SessionController } from "./controller/SessionController"
import { ContaController } from "./controller/ContaController"
import { NextFunction, Request, Response } from "express"
import { Session } from "./entity/Session"
import { Userr } from "./entity/Userr"
import { TypeormStore } from "connect-typeorm"
import { AcountValidator } from "./entity/AcountValidator"
import { FaleConosco } from "./entity/FaleConosco"
import { EmailController } from "./controller/EmailController"
import { json } from "body-parser"
///////////////////////////////////////////////////////////////////////////////////



AppDataSource.initialize().then(async () => {


    /////////////IMPORTS///////////////
    const express = require('express')
    const app = express()
    const request = require('request')

    let Parser = require('rss-parser');
    let parser = new Parser();
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
    const fcController = new FaleConoscoController
    //////////////////////////////////////////////////////////////////
   
    
    /////////////////////////////////////////////////////////////////////////
    //////////////////////////ROTAS DE NAVEGAÇÃO/////////////////////////////
    /////////////////////////////////////////////////////////////////////////

    app.get('/feed', (req: Request, res: Response, next: NextFunction ) => {
       
        (async () => {

            let feed = await parser.parseURL('http://g1.globo.com/dynamo/brasil/rss2.xml');
            console.log(feed);
          
         
          
          })();
    })

    //Rota Prisma
    app.get('/', (req: Request, res: Response, next: NextFunction ) => {
       
        sessionController.prismaSess(req)
        console.log(req.session)
        let carrossel = publicacaoController.allPrisma()
        
        if(carrossel instanceof Promise){
            carrossel.then((car)=>{
                let car1 = car[0];
                delete car[0];

                //Colocar em uma função para ser acessado por outras páginas sem precisar reescrever
                (async () => {

                    let feed = await parser.parseURL('https://adrenaline.com.br/rss');
                    
                    let feed0 = JSON.parse(JSON.stringify(feed.items[0]));
                    let img0 = feed0.enclosure.url;
                    let date0 = feed0.pubDate.split("+")[0];
                    let feed1 = JSON.parse(JSON.stringify(feed.items[1]));
                    let date1 = feed1.pubDate.split("+")[0];
                    let img1 = feed1.enclosure.url;
                    let feed2 = JSON.parse(JSON.stringify(feed.items[2]));
                    let date2 = feed2.pubDate.split("+")[0];
                    let img2 = feed2.enclosure.url;
                  
                    res.render("prisma.hbs" , {
                        login: req.session.login, 
                        user: req.session.user, 
                        adm: req.session.administrador,
                        ativo: car1,
                        carousel: car,
                        rss0 : feed0,
                        img0 : img0,
                        date0 : date0,
                        rss1 : feed1,
                        img1 : img1,
                        date1 : date1,
                        rss2 : feed2,
                        img2 : img2,
                        date2: date2,
                       })                  
                  })();
                })
            }})

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

    //Rota FaleConosco
    app.post('/faleConosco', (req: any, res: any , next: NextFunction) => {

        recaptcha.verify(req, function (error, data) {
            if (!error) {
                let result = fcController.save(req);
                result.then((fc)=>{
                    if(fc instanceof FaleConosco){               
                        res.render("fcFeedback.hbs", {mensagem: "Agradecemos a sua mensagem! Em breve entraremos em contato. "})
                    }else{
                        res.render("fcFeedback.hbs", {mensagem: "Tente novamente mais tarde."})
                    }   
                })  
            } else {
                res.render("fcFeedback.hbs", {mensagem: "Tente novamente mais tarde."})
            }
        })
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
    app.get('/validarUsuario/:secret/:newAcount',  (req: any, res: any , next: NextFunction ) => {

        //remover validadores expirados juntamente com os respectivos cadastros aqui(implementar função no controlador)
        //usar getTime() diff 3,6 x10^6 
        console.log("secret: '"+req.params.secret+"'")
        sessionController.secretSess(req)
        let validador = acountValidatorController.oneBySessionSecret(req)
        
        validador.then((validador)=>{
            console.log("validador: "+JSON.stringify(validador))
            if(validador !== null){
                sessionController.validatingSess(req, validador)
                res.render("validarSecret.hbs", {captcha : recaptcha.render()}) 
            }else{
                console.log("sair1")
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
                    console.log("sessionNew: "+req.session.newEmail)
                    contaController.efetiveAtualizacao(req, res, next)
                }
                else if(req.session.validating){
                    if(senha == user.password){
                        contaController.validarConta(user).then((result)=>{
                            if(result){
                                sessionController.validatingEndSess(req)
                                res.render('cadastroValidado.hbs')
                            }
                        }) 
                    }else{
                        console.log("sair2")
                        res.redirect('/sair')
                    } 
                }
            })
            } else {
                console.log("sair3")
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

        //Remover acValidador vencidos aqui
        let validador = acountValidatorController.oneBySession(req)
        validador.then((acValidador)=>{
            if(acValidador instanceof AcountValidator){
                console.log("email: "+req.session.email)
                sessionController.validatingSess(req, acValidador)
                console.log("email: "+req.session.email)
                console.log("body: "+JSON.stringify(req.body))
                console.log("validador:"+JSON.stringify(acValidador))
                if(acValidador.newAcount){
                    emailController.enviar(acValidador.email, acValidador.parameter, acValidador.newAcount)
                }else{
                    emailController.enviar(acValidador.newEmail, acValidador.parameter, acValidador.newAcount)
                }   
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



