const mongoose = require( 'mongoose')
const dotenv = require( 'dotenv')

dotenv.config()

let url = 'mongodb+srv://'+
`${process.env.USUARIO}:${process.env.SENHA}`+
'@cluster0-h5y5e.mongodb.net/'+
`${process.env.DATABASE}?retryWrites=true&w=majority`

/**
 * Classe de conexão do banco de dados mongodb
 * No iniciador da classe é feito a conexão e importada para a API
 */
module.exports = class MongoDB {
    database

    constructor(){
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>{
            console.log("MongoDB is running at " + url);
        }).catch((err) => {
            console.error(err);
        });
    }
}