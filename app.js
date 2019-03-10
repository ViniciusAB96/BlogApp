//carregando os módulos do app.
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
//estou pegando o arquivo admin que está dentro da pasta root e atribuindo a variável admin 
const admin = require('./routes/admin'); // é uma boa prática colocar o mesmo nome da constante que carregará o módulo/rota com o nome do arquivo

//Para carregar a pasta Public com os arquivos de JavaScript e CSS do Bootstrap
const path = require("path")//módulo padrão do node para trabalhar com diretórios e carregar pastas.

const mongoose = require('mongoose');
//carregando os dois módulos de sessão
const session = require('express-session');
const flash = require('connect-flash'); //o flash é um tipo de sessão que somente aparece uma vez.

const app = express(); //variável que vai receber a função do express.

//Configuraçoes do app
    //Configurando a sessão 
    //O app.use serve para a criação e configuração de middlewares.
        app.use(session({
            secret: "cursodenode", //é uma chave para gerar uma sessão para mim.
            resave: true,
            saveUninitialized: true
        }));//estou passando um objeto dentro do session.
        //para configurar o flash basta eu colocar o seguinte abaixo da sessão, e tem que ser abaixo da sessão.
        app.use(flash()); //tem que ser usado sempre abaido do session

    //Middleware
        app.use((req, res, next) => {
            //aqui eu irei colocar duas variáveis globais, que eu conseguirei ter acesso em toda a minha aplicação.
            res.locals.success_msg = req.flash("success_msg");
            res.locals.error_msg = req.flash("error_msg");
            // 0 res.local é utilizado para eu criar variáveis globais.
            next();
        });


    //body-parser
        app.use(bodyParser.urlencoded({extended:true}));
        app.use(bodyParser.json());

    //Handle-Bars
        app.engine('handlebars', handlebars({defaultLayout:'main'})); //o main é o template padrão da aplicação.
        app.set('view engine', 'handlebars')
    //Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost:27017/blogapp", {useNewUrlParser: true}).then(() =>{
            console.log("Conectado ao Mongo na porta: 27017");
        }).catch((err) => {
            console.log("Erro ao se conectar: "+ err);
        })
    
    //Public
        //para falar para o express que a pasta que guarda todos os arquivos estáticos de chama public
        //path.join(__dirname,"public") é utilizado para eu pegar o caminho absoluto para a pasta public
        app.use(express.static(path.join(__dirname, "public")));

        //criando um midware
      /*  app.use((req, res, next) =>{
            console.log('oi, eu sou um midware! HIHI');
            //sempre que eu criar um midware, eu não posso esquecer de colocar um next() no final.

            next(); //irá mandar passar a requisição.
        });*/


     //Sempre chamar as rotas abaixo das configurações.
//Rotas do app
        //Muitas rotas em um mesmo arquivo fica difícil de se manter.
        //Logo para uma aplicação grande como essa será necessário a utilização de um componente do Express chamado Router.

app.get('/', (req, res) => {
    res.send('Página principal da aplicação.');
})

app.get('/posts', (req, res) => {
    res.send('Lista de Posts');
})

//quando eu crio um grupo de rotas separadas, eles terão um prefixo, no caso abaixo o prefixo é /admin e após isso eu coloco as rotas referentes ao admin.
app.use('/admin', admin); //utilizo o use para determinal qual será o prefixo do meu grupo de rotas, que utilizará a variável admin
    
//Outros
const PORTA= 8091;
app.listen(PORTA, () => {
    console.log('Servidor Rodando na porta 8091 ...')
})