
import { AppDataSource } from "./data-source"
import { Userr } from "./entity/Userr"

AppDataSource.initialize().then(async () => {

    //Configuração do express app
    const express = require('express')
    const app = express()

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



    // start express server
    app.listen(3000)

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

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results")

}).catch(error => console.log(error))

