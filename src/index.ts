
import { AppDataSource } from "./data-source"
import { Userr } from "./entity/Userr"

AppDataSource.initialize().then(async () => {

    //Configuração do express app
    const express = require('express')
    const app = express()

    const https = require('https')
    const fs = require('fs')

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


    app.use((req, res, next) => { //Cria um middleware onde todas as requests passam por ele
        
        if (req.secure){ //Se a requisição feita é segura (é HTTPS)
            next(); //Não precisa redirecionar, passa para os próximos middlewares que servirão com o conteúdo desejado
        }else{ //Se a requisição não for segura (é HTTP)
            res.redirect(`https://${req.hostname}${req.url}`); //Redireciona a requisição para o mesmo host e url mas com HTTPS e termina a request
        }
    });

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

    //Configurando servidor Https
    //OBS: Ler certificado e chave em utf8 para funcionar corretamente
    let certKey = fs.readFileSync(__dirname+'/SSL/certificate.key', 'utf8')
    let certificate = fs.readFileSync(__dirname+'/SSL/certificate.crt','utf8')
    let credential = {key: certKey, cert: certificate}
    const httpsServer = https.createServer(credential, app);
        
    const PORT1 = process.env.PORT1 || 3000
    app.listen(PORT1, () => {
        console.log('Servidor Http Online')});

    // start express server
    const PORT = process.env.PORT || 443
    httpsServer.listen(PORT, () => {
      console.log('Servidor Https Online')
    });



    /**  insert new users for test
    await AppDataSource.manager.save(
        AppDataSource.manager.create(Userr, {
            firstName: "Eduardo",
            lastName: "Proto",
            age: 27
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

