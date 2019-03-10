//arquivo para chamar todas as minhas rotas de admin

const express = require("express");
const router = express.Router(); //esse componente que eu uso para criar rotas em arquivos separados.
//Requisitando os módels
const mongoose = require("mongoose")//Importando o Mongoose
require("../models/Categoria"); //realizando um require para o meu modulo Schema de Categorias (Chamando o arquivo do Model)
const Categoria = mongoose.model("categorias"); //pegando do meu módulo de categorias o schema categorias que eu criei. (Passando a referencia do meu módulo para uma variável)
//requisitando o módulo de Posts
require("../models/Postagens");
const Postagem = mongoose.model("postagens")


//Rota Principal

//para definir uma rota em um arquivo separado eu não irei utilizar o app.get, ou post, mas sim o router.get, ou router.post.
router.get('/', (req, res)=>{//estou utilizando arrow functions aqui, mano, quanto menos eu escrever melhor...
    res.render("admin/index"); //consigo chamar outros por meio do handlebars 
});


//Rota de Posts

router.get('/posts', (req, res) =>{
    res.send("Página de posts");
});

//Rotas de categorias

router.get('/categorias', (req,res) => {
    //o mongoose tem uma função que se chama find, essa funçao irá listar todas as categorias que existem
    Categoria.find().sort({date:'desc'}).then((categorias) =>{ //estou listando os posts pelo campo date
        res.render("admin/categorias", {categorias: categorias});
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias." + error);
        res.redirect("/admin")
    })
    
}); 

router.get('/categorias/add', (req, res) => {

    res.render("admin/addCategorias");
});

router.post("/categorias/nova", (req, res) => { //rota que eu irei utilizar para salvar a minha categoria no banco de dados.
        
    var erros = []
    //vem lá do formulário
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto:"Nome inválido."});
    };//validação do campo nome
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto:"Slug inválido."});
    };

    if(req.body.nome.length < 2 ){
        erros.push({texto: "Nome da categoria é muito pequeno"});
    }

    if(erros.length > 0){
        res.render("admin/addCategorias", {erros: erros})
    }
    else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
       
        new Categoria(novaCategoria).save().then(() => {
            
            req.flash("success_msg", "Categoria criada com sucesso")
            res.redirect("/admin/categorias");//redirecionando para a página de categorias
             console.log('Categoria salva com sucesso');
        }).catch((erro) =>{
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!!")
            res.redirect("/admin")
            // console.log("Erro ao tentar cadastrar uma categoria: " + erro);
        })
    }
    
})


router.get("/categorias/edit/:id", (req, res)  => {
    Categoria.findOne({_id:req.params.id}).then((categoria) =>{
        res.render("admin/editCategorias", {categoria: categoria});
    }).catch((error) => {
        req.flash("error_msg", "Esta categoria não existe.");
        res.redirect("/admin/categorias")
    })
   
})

router.post("/categorias/edit", (req, res) => {
    Categoria.findOne({_id: req.body.id}).then((categoria) => {
        categoria.nome = req.body.nome; //Ou seja estou falando que o meu campo nome irá receber o valor que eu estou passando do formulário
        categoria.slug = req.body.slug;//estou falando que o meu campo slug irá receber o valor que eu estou passando do formulário
        
        //posso vazer a validação dos campos nessa parte.
        categoria.save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso");
            res.redirect('/admin/categorias');
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro inteno ao tentar salvar a categoria.");
            res.redirect("/admin/categorias");
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria");
        res.redirect("/admin/categorias");
    });
})

router.post("/categorias/deletar", (req, res) => {
    Categoria.remove({_id: req.body.id}).then( () => {
        req.flash("success_msg", "Categoria deletada com sucesso.");
        res.redirect("/admin/categorias");

    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao tentar deletar a categoria." + error);
        res.redirect("/admin/categorias")
    }); //estou usando o req.body pois a informação do id vem do formulário de delete.
});



//Rotas de postagens

router.get("/postagens", (req, res) => {
    //para usar o pupulate, eu tenho que usar o nome do campo referência no documento, no caso ele se chama categoria
    Postagem.find().populate("categoria").sort({date: 'desc'}).then((postagens) => {
        res.render("./admin/postagens", {postagens: postagens}); // quando eu faço um render eu posso ou não utilizar o ./ inicial, ou omitir 
    }).catch((error)=>{
        req.flash("error_msg", "Houve um erro ao listar as postagens");
        res.redirect("/admin");
    });
});

router.get("/postagens/add", (req, res) => {
    Categoria.find().then((categorias)=>{
        res.render("admin/addPostagem", {categorias: categorias}) //estou passando todas as categorias que existem para dentro da minha view de postagem.
    }).catch((error) =>{
        req.fresh("error_msg", "Houve um erro ao carregar o formulário.");
        res.redirect("/admin");
    });
});

router.post("/postagens/nova", (req, res)=>{
    var erros = []
    if(req.body.categoria == "0"){
        erros.push({text: "Categoria inválida, registre uma categoria."});
    }
    if(erros.length > 0){
        res.render("admin/addPostagem", {erros: erros})
    }else{
        const novaPostagem = {
             titulo: req.body.titulo,
             descricao: req.body.descricao,
             conteudo: req.body.conteudo,
             categoria: req.body.categoria,
             slug: req.body.slug
        }
        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso!!!");
            res.redirect("/admin/postagens");
        }).catch((error)=> {
            req.flash("error_msg", "Houve um erro durante o salvamento da postagem.");
            res.redirect("/admin/postagens");
        })
    }
})

router.get("/postagens/edit/:id", (req, res) =>{
    Postagem.findOne({_id: req.params.id}).then((postagem)=>{

        Categoria.find().then((categorias)=>{
            res.render("admin/editPostagens", {categorias: categorias, postagem: postagem});
        }).catch((error)=>{
            req.flash("err.msg", "Houve um erro ao listar as categorias.");
            res.redirect("/admin/postagens");
        })

    }).catch((error) =>{
        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição.")
        res.redirect("/admin/postagens")
    })
  
});

router.post("/postagem/edit", (req, res) => {
    Postagem.findOne({_id: req.body.id}).then((postagem)=>{
       postagem.titulo = req.body.titulo;
       postagem.slug = req.body.slug;       
       postagem.descricao = req.body.descricao;
       postagem.conteudo = req.body.conteudo;
       postagem.categoria = req.body.categoria;

       postagem.save().then(() =>{
            req.flash("success_msg", "Postagem editada com sucesso.");
            res.redirect("/admin/postagens");
       }).catch((error)=>{
            req.flash('error_msg', "Erro interno");
            res.redirect("/admin/postagens");
       });
    }).catch((error)=>{
        req.flash('error_msg', "Houve um erro ao salvar a edição " + error);
        res.redirect("/admin/postagens");
    });
});


router.get("/postagens/deletar/:id", (req, res) =>//forma não tão segura de se deletar um registro
{
    Postagem.remove({_id: req.params.id}).then(()=>{
        req.flash('success_msg', "Sucesso ao deletar a mensagem");
        res.redirect("/admin/postagens")
    }).catch((error)=>{
        req.flash('error_msg', "Houve um erro ao deletar o post " + error);
        res.redirect("/admin/postagens");
    })
})
module.exports = router; //eu sempre vou precisar exportar o arquivo no final, para que eu consiga utilizá-lo no meu app.js
