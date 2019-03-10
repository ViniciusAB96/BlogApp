const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const Postagem = new Schema({
    titulo:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required:true
    },
    descricao:{
        type: String,
        require: true
    },
    conteudo:{
        type: String,
        required: true
    },
    categoria:{
        type: Schema.Types.ObjectId,//A melhor forma de fazer um relacionamento entre documentos é dizer que eu tenho um docuento que irá guardar o id de outro documento, relacionando-os. Para isso eu utilio o seguinte.
       //quando eu crio esse tipo, eu tenho que colocar uma referencia. Ou seja, qual tipo de objeto que eu estou passando.
       //no caso eu tenho que referenciar com o mesmo nome que eu dei ao meu módulo Categoria.
        ref: "categorias",
        required:true
    },
    date: {
        type: Date,
        default: Date.now()
    }

});

mongoose.model("postagens", Postagem);