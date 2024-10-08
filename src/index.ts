/////////////////////////////////////IMPORTS///////////////////////////////////////
import { AppDataSource } from "./data-source"
import { UserController } from "./controller/UserController"
import { FaleConoscoController } from "./controller/FaleConoscoController"
import { ContatoController } from "./controller/ContatoController"
import { AcountValidatorController } from "./controller/AcountValidatorController"
import { SessionController } from "./controller/SessionController"
import { ContaController } from "./controller/ContaController"
import { NextFunction, Request, Response } from "express"
import { Session } from "./entity/Session"
import { User } from "./entity/User"
import { TypeormStore } from "connect-typeorm"
import { AcountValidator } from "./entity/AcountValidator"
import { EmailController } from "./controller/EmailController"
import { Cifra } from "./controller/Cifra"
import getFeed from "./feed"
import { AdmController } from "./controller/AdmController"

///////////////////////////////////////////////////////////////////////////////////

declare module "express-session" {
    interface Session {
        login: boolean;
        user: string;
        email: string;
        secret: string;
        administrador: boolean;
        relogin: boolean;
        validating: boolean;
        newAcount: boolean;
        newEmail: string;

    }
  }



AppDataSource.initialize().then(async () => {


    /////////////IMPORTS///////////////
    const express = require('express')
    const app = express()
    require('dotenv').config()  
    ///////////////////////////////////


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
            secret: "53Cr3TTp1RI5waApPiNc0nT@yg3",
            store: new TypeormStore({
                cleanupLimit: 500,
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
        '6LdFP-4kAAAAADDlz8t23azcitK-oQSrEDD1nFvu', 
        '6LdFP-4kAAAAAJ8YBdZeIKH0g_mQtw7Al1C92Kwl', 
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
    const acountValidatorController = new AcountValidatorController
    const sessionController = new SessionController
    const contaController = new ContaController
    const emailController = new EmailController
    const fcController = new FaleConoscoController
    const contatoController = new ContatoController
    const cifrador = new Cifra
    const admController = new AdmController
    //////////////////////////////////////////////////////////////////
   
    
    /////////////////////////////////////////////////////////////////////////
    //////////////////////////ROTAS DE NAVEGAÇÃO/////////////////////////////
    /////////////////////////////////////////////////////////////////////////
 

    //Rota Prisma
    app.get('/', (req: Request, res: Response, next: NextFunction ) => {
       
        sessionController.prismaSess(req)

        let feed  = getFeed();
        feed.then((feed)=>{
            res.render("prisma.hbs" , {
                captcha: recaptcha.render(),
                login: req.session.login, 
                user: req.session.user, 
                adm: req.session.administrador,
                rss: feed,
                instagram: process.env.INS_PRI,
                facebook: process.env.FAC_PRI,
                linkedin: process.env.LIN_PRI
                }) 
        })  
     })
           
   
    //Rota PrismaInfo
    app.get('/prismaInfo', (req, res) => {
        let feed  = getFeed();
        feed.then((feed)=>{
            res.render("prismaPage.hbs", {
                captcha: recaptcha.render(),
                login: req.session.login, 
                user: req.session.user, 
                adm: req.session.administrador,
                rss: feed,
                instagram: process.env.INS_PRI,
                facebook: process.env.FAC_PRI,
                linkedin: process.env.LIN_PRI
                }) 
        })

    })
    //Rota F&F
    app.get('/fef', (req, res) => {
        let feed  = getFeed();
        feed.then((feed)=>{
            res.render("fef.hbs", {
                captcha: recaptcha.render(),
                login: req.session.login, 
                user: req.session.user, 
                adm: req.session.administrador,
                rss: feed,
                instagram: process.env.INS_FEF,
                facebook: process.env.FAC_FEF,
                linkedin: process.env.LIN_PRI
                }) 
        })
    })

    //Rota DSOP
    app.get('/dsop', (req, res) => {
        let feed  = getFeed();
        feed.then((feed)=>{
            res.render("dsop.hbs", {
                captcha: recaptcha.render(),
                login: req.session.login, 
                user: req.session.user, 
                adm: req.session.administrador,
                rss: feed,
                instagram: process.env.INS_DSO,
                facebook: process.env.FAC_DSO,
                linkedin: process.env.LIN_PRI
                }) 
        })
    })

    //Rota Futurum
    app.get('/futurum', (req, res) => {
        let feed  = getFeed();
        feed.then((feed)=>{
            res.render("futurum.hbs", {
                captcha: recaptcha.render(),
                login: req.session.login, 
                user: req.session.user, 
                adm: req.session.administrador,
                rss: feed,
                instagram: process.env.INS_FUT,
                facebook: process.env.FAC_FUT,
                linkedin: process.env.LIN_PRI
                }) 
        })
    })

    //Rota Luz
    app.get('/luz', (req, res) => {
        let feed  = getFeed();
        feed.then((feed)=>{
            res.render("luz.hbs", {
                captcha: recaptcha.render(),
                login: req.session.login, 
                user: req.session.user, 
                adm: req.session.administrador,
                rss: feed,
                instagram : process.env.INS_LUZ,
                facebook: process.env.FAC_LUZ,
                linkedin: process.env.LIN_PRI
                }) 
        })
    })

    //Rota Next
    app.get('/next', (req, res) => {
        let feed  = getFeed();
        feed.then((feed)=>{
            res.render("next.hbs", {
                captcha: recaptcha.render(),
                login: req.session.login, 
                user: req.session.user, 
                adm: req.session.administrador,
                rss: feed,
                instagram: process.env.INS_NEX,
                facebook: process.env.FAC_PRI,
                linkedin: process.env.LIN_PRI
                }) 
        })
    })

    //Rota FaleConosco
    app.post('/faleConosco', (req: any, res: any , next: NextFunction) => {  

        recaptcha.verify(req, function (error, data) {
            
            if (!error) {
                let result = fcController.save(req, res);
                if(result){
                    let feed  = getFeed();
                    feed.then((feed)=>{          
                        res.render("fcFeedback.hbs", {
                            login: req.session.login, 
                            user: req.session.user, 
                            adm: req.session.administrador,
                            mensagem: "Agradecemos a sua mensagem! Em breve entraremos em contato. ",
                            rss: feed})
                    }) 
                }  
            } else {
                res.redirect('/')
            }
        })
 
    }) 

    //Rota Contato
    app.post('/Contato', (req: any, res: any , next: NextFunction) => {

        recaptcha.verify(req, function (error, data) {
            
            if (!error) {
                let result = contatoController.save(req, res);

                if(result){
                    let feed  = getFeed();
                    feed.then((feed)=>{          
                        res.render("fcFeedback.hbs", {
                            login: req.session.login, 
                            user: req.session.user, 
                            adm: req.session.administrador,
                            mensagem: "Agradecemos a sua mensagem! Em breve entraremos em contato. ", 
                            rss: feed})
                    }) 
                } 
            } else {
                res.redirect('/')
            }
        })
    

    })

    //Rota Contactar   
    app.get('/contactar', (req: Request, res: Response , next: NextFunction ) => {
        let feed  = getFeed();
        feed.then((feed)=>{
            res.render("contato.hbs", {
                captcha: recaptcha.render(),
                login: req.session.login, 
                user: req.session.user, 
                adm: req.session.administrador,
                rss: feed,
                instagram: process.env.INS_PRI,
                facebook: process.env.FAC_PRI,
                linkedin: process.env.LIN_PRI
                }) 
        })
    } )

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
            if(req.session.user === "" || req.session.user == undefined){
                sessionController.sairSess(req)
                res.render("login.hbs", {captcha: recaptcha.render(), captchaErr : false, relogin: req.session.relogin});
            }else{
                res.render("userLogadoErr", {user: req.session.user})
            }   
        }           
    })

    //Rota Entrar
    app.post('/entrar', (req: any, res: any , next: NextFunction ) => {
              
        recaptcha.verify(req, function (error, data) {
         
            if (!error) {
                let result = userControler.one(req)
                result.then((usr)=>{

                        if(usr instanceof User){ 
                            let decryptUsr =  cifrador.decryptUser(usr)
                    
                            decryptUsr.then((user) => {              
                                sessionController.logar(req, res, next, recaptcha, user)
                        })
                        }else{
                            sessionController.loginSess(req, null, true)
                            res.render("login.hbs", {captcha: recaptcha.render(), captchaErr : false, relogin: true});
                        }
                    
                })  
            } else {

                res.redirect('/')
                //req.session.relogin = false
                //res.render("login.hbs", {captcha: recaptcha.render(), captchaErr : true, status: "Falha no captcha", relogin: false});
            }
        })
    });


    //Rota Cadastrar
    app.get('/cadastrar', (req, res) => {

        sessionController.cadastrarSess(req)

        if(req.session.login == true){
            if(req.session.user === "" || req.session.user == undefined){

                sessionController.sairSess(req)
                res.redirect('/login')

            }else{

                res.render("userLogadoErr", {user: req.session.user})

            }
        }else{
            let feed  = getFeed();
            feed.then((feed)=>{
                res.render("cadastrar.hbs", {captcha: recaptcha.render(), captchaErr : false, rss: feed})
            })
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
            let usr = contaController.admConta(req, res, next)
            usr.then((usr) => {
            let user = cifrador.decryptUser(usr)
            user.then((user) => {
                let feed  = getFeed();
                feed.then((feed)=>{
                    res.render("conta.hbs", {
                        captcha: recaptcha.render(),
                        usuario : user,
                        user: user.firstName, 
                        login : req.session.login, 
                        atualizacao : false, 
                        rss : feed,
                        instagram: process.env.INS_PRI,
                        facebook: process.env.FAC_PRI,
                        linkedin: process.env.LIN_PRI    
                    })
                })
            })     
           })
           
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

        let vencidos =  acountValidatorController.remVencidos()
        vencidos.then((arr)=>{
            arr.forEach(email => {
                let resutTe = contaController.remTE(email)
                
                resutTe.then((atualizacao)=>{  
                      
                    let userToRemove =  userControler.oneByEmail(email)     
                    userToRemove.then((user)=>{
                        if(atualizacao){ 
                            user.atualizarEmail = false
                            userControler.atualizar(user)
                        }else{
                            userControler.removeUser(user)
                        }
                        }) 
                    
                })
            })
        }).then(()=>{
            sessionController.secretSess(req)
            let validador = acountValidatorController.oneBySessionSecret(req)
            validador.then((validador)=>{ 
               
                if(validador !== null){
                    sessionController.validatingSess(req, validador)
                    res.render("validarSecret.hbs", {captcha : recaptcha.render()}) 
                }else{
                  
                    res.redirect('/sair')
                }
            })
        })
       
    })

    app.get('/reenviarEmail', (req, res, next) => {
        
        let vencidos =  acountValidatorController.remVencidos()
        vencidos.then((arr)=>{
            arr.forEach(email => {
                let resutTe = contaController.remTE(email)
                
                resutTe.then((atualizacao)=>{

                    let userToRemove =  userControler.oneByEmail(email)     
                    userToRemove.then((user)=>{
                        if(atualizacao){ 
                            user.atualizarEmail = false
                            userControler.atualizar(user)
                        }else{
                            userControler.removeUser(user)
                        }
                    }) 
                })
            })
        }).then(()=>{
    
            let validador = acountValidatorController.oneBySession(req)
            validador.then((acValidador)=>{
                if(acValidador instanceof AcountValidator){
                    
                    sessionController.validatingSess(req, acValidador)
                    if(acValidador.newAcount){
                        emailController.enviar(acValidador.email, acValidador.parameter, acValidador.newAcount)
                    }else{
                        emailController.enviar(acValidador.newEmail, acValidador.parameter, acValidador.newAcount)
                    }   
                }
            }).then(()=>{
                let feed  = getFeed()
                feed.then((feed)=>{
                    res.render("avisoDeChecagem.hbs", {rss : feed} )
                })
            })
        })
    })

    //Rota complementar para validação de conta
    app.post('/validarSecret',  (req: any, res: any , next: NextFunction ) => {
        recaptcha.verify(req,  function (error, data) {
            if (!error) {
                let password = req.body.password
              
                let usuario = userControler.oneByEmail(req.session.email)
            
                usuario.then((usr)=>{

                        let dcryptUser = cifrador.decryptUser(usr)

                        dcryptUser.then((user) => {
                        
                            if(user.password == password){

                                if(user.atualizarEmail){
                            
                                    contaController.efetiveAtualizacao(req, res, next)
                                }
                                else if(req.session.validating){
                      
                                    contaController.validarConta(user).then((result)=>{
                                        if(result){
                                            sessionController.validatingEndSess(req)
                                            res.render('cadastroValidado.hbs')
                                        }
                                    }) 
                                    } 
                            }else{
                                res.redirect('/sair')
                            } 
                        })
                })       
            } else {
                
                res.redirect('/sair')
            }
        })})
    
    app.post('/removerConta', (req: any, res: any , next: NextFunction ) => {
        if(req.session.login == true){
            let user = userControler.oneByEmail(req.session.email)
            user.then((usr)=>{
                let result = userControler.removeUser(usr)
                result.then((removed)=>{
                    if(removed){
                        res.redirect('/sair')
                    }else{
                        res.send("Usuário não removido")
                    }
                })
            })
         }else{
             res.redirect('/sair')
         }
    })


    
    ///////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////////////
    ///////////////////ROTAS RELACIONADAS A ADMINISTRAÇÃO DO SITE///////////////////
    ////////////////////////////////////////////////////////////////////////////////

    //Página Pricipal de administracao
    app.get('/administrarSite', (req: any, res: any , next: NextFunction ) => {
        if(req.session.administrador == true){    
            res.render('adm.hbs') 
        }else{
            res.redirect('/')
        }
    })

    //getAdms
    app.get('/getAdms', (req: any, res: any , next: NextFunction ) => {
        if(req.session.administrador == true){
            let adms = admController.all()

            adms.then((ad) =>{
                let ad2 = []
                ad.forEach(el => {
                    if(el.email != req.session.email){ad2.push(el)}
                });
                res.render('administradores.hbs', {data : ad2})
            })
            
        }else{
            res.redirect('/')
        }
    })

    //delAdm
    app.get('/delAdm/:id', (req: any, res: any , next: NextFunction ) => {
        if(req.session.administrador == true){
            let admForId = admController.oneForId(req)
            admForId.then((adm) => {
                let result = admController.removeAdm(adm)
                result.then((del) => {
                    if(del){
                        let adms = admController.all()
                        adms.then((ad) =>{
                            let ad2 = []
                            ad.forEach(el => {
                                if(el.email != req.session.email){
                                    ad2.push(el)
                                }
                            });
                            res.redirect('/getAdms')
                        })
                    }else{
                        res.redirect('/getAdms')  
                    }   
                })
            })
        }else{
            res.redirect('/')
        }
    })

    //addAdm
    app.post('/addAdm', (req: any, res: any , next: NextFunction ) => {
        if(req.session.administrador == true){
            let adm = req.body
            let save =  admController.save(adm)
            save.then((result) => {
                if(result){
                    let adms = admController.all()
                    adms.then((ad) =>{
                        let ad2 = []
                        ad.forEach(el => {
                            if(el.email != req.session.email){ad2.push(el)}
                        });
                        res.render('administradores.hbs', {data : ad2})
                    }) 
                }else{
                    res.redirect('/administrarSite')
                }
            })
        }else{
            res.redirect('/')
        }
    })

    //getMensagens
    app.post('/getMensagens', (req: any, res: any , next: NextFunction ) => {
        if(req.session.administrador == true){
            let nome = req.body.nome_mens
            nome = nome.trim()
            if(nome == ""){
                let allCont =  contatoController.all()
                allCont.then((ctts) => {
                    let allFc   =   fcController.all()
                    allFc.then((fcs) => {
                        res.render("mensagens.hbs", {contatos: ctts, fConosco: fcs})
                    })
                })
            }else{
                let nome = req.body.nome_mens
                nome = nome.trim()
                let allCont = contatoController.allselected(nome) 
                allCont.then((ctts) => {
                    let allFc   =   fcController.allselected(nome)
                    allFc.then((fcs) => {
                        res.render("mensagens.hbs", {contatos: ctts, fConosco: fcs})
                    })
                }) 
            }   
        }else{
            res.redirect('/')
        }
    })

    //delMens
    app.get('/delMens/:tipo/:id', (req: any, res: any , next: NextFunction ) => {
        if(req.session.administrador == true){
            let tipo = req.params.tipo
            let id   = req.params.id

            if(tipo  == "ctt" ){
                let ctt =  contatoController.oneById(id)
                ctt.then((talk)=>{
                    let result = contatoController.removeContato(talk)
                    result.then((removed)=>{
                        if(removed){
                            res.redirect("/administrarSite")
                        }
                    })
                })
            }else if(tipo == "fc"){
                let fc =  fcController.oneById(id)
                fc.then((talk)=>{
                    let result = fcController.removefaleConosco(talk)
                    result.then((removed)=>{
                        if(removed){
                            res.redirect("/administrarSite")
                        }
                    })
                })
            }
        }else{
            res.redirect('/')
        }
    })

    //getClientes
    app.post('/getClientes', (req: any, res: any , next: NextFunction ) => {
        if(req.session.administrador == true){
            let nome = req.body.nome_cli
            nome = nome.trim()
            if(nome == ""){
                let allUser =  userControler.all()
                allUser.then((users) => {     
                    res.render("clientes.hbs", {users: users})
                })
            }else{
                let selUser =  userControler.allselected(nome)
                selUser.then((users) => {

                    res.render("clientes.hbs", {users: users})
                }) 
            }   
        }else{
            res.redirect('/')
        }
    })

    //delCli
    app.get('/delCli/:id', (req: any, res: any , next: NextFunction ) => {
        if(req.session.administrador == true){

            let id   = req.params.id
            let user =  userControler.oneById(id)

            user.then((usr)=>{
                if(usr.email != req.session.email){
                    if(!usr.valid){
                        let val = acountValidatorController.oneByEmail(usr.email)
                        val.then((vld)=>{
                            acountValidatorController.remove(vld)
                        })
                    }
                    if(usr.atualizarEmail){
                        let val = acountValidatorController.oneByEmail(usr.email)
                        val.then((vld)=>{
                            acountValidatorController.remove(vld)
                        }) 
                        contaController.remTE(usr.email)   
                    }
                    let result = userControler.removeUser(usr)
                    result.then((removed)=>{
                        if(removed){
                            res.redirect("/administrarSite")
                        }
                    })

                }else{
                    res.redirect("/administrarSite")
                }
            })
        }else{
            res.redirect('/')
        }
    })

    //Rota de créditos
    app.get('/copyrights', (req: Request, res: Response , next: NextFunction ) => {
        let feed  = getFeed();
        feed.then((feed)=>{
            res.render("copyrights.hbs" , {rss: feed})
        })
    })
    
    ///////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////


    ////////////////UP SERVICE///////////////////
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log('Servidor Http Online')});
    /////////////////////////////////////////////
   
}).catch(error => console.log(error))