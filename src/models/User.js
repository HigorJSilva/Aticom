const validator = require('validator');
const cpf = require('brazilian-values')
const bcrypt =  require('bcryptjs');
const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const config  = require('../config.json')

const matrizes = []

config.matrizes.map(matriz => (
    matrizes.push( matriz.ano)
))


const schema = new Schema({
    nome: { type: String, required: true },
    email: { type: String, unique: true, required: true,  
            validate: [ validator.isEmail, 'Email inválido' ] },

    senha: { type: String, required: true, minlength: 6 },
    CPF: { type: String, unique: true, required: true, maxlength: 11, 
            minlength:11, validate:[cpf.isCPF, "CPF inválido"]},

    matriz: { type: String, required: true,  enum: matrizes},
    
    role:{type: String, enum: ['User', 'Admin','CA'], default: "User"},

    isPendente:{ type: Boolean, required: true, default: false },

    isCompleto: { type: Boolean, required: true, default: false }
});

schema.set('toJSON', { virtuals: true });

schema.pre('save', async function(next){

    const hash = await bcrypt.hash(this.senha, 10)
    this.senha = hash;

    next();
} );

module.exports = mongoose.model('User', schema);