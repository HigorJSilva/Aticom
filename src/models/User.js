const validator = require('validator');
const cpf = require('brazilian-values')
const bcrypt =  require('bcryptjs');
const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const schema = new Schema({
    nome: { type: String, required: true },
    email: { type: String, unique: true, required: true,  
            validate: [ validator.isEmail, 'Email inválido' ] },

    senha: { type: String, required: true },
    // string 11 digits
    CPF: { type: String, unique: true, required: true, maxlength: 11, 
            minlength:11, validate:[cpf.isCPF, "CPF inválido"]},

    role:{type: String, enum: ['User', 'Admin'], default: "User"},

    isPendente:{ type: Boolean, required: true, default: false },

    isCompleto: { type: Boolean, required: true, default: false }
});

schema.set('toJSON', { virtuals: true });

schema.pre('save', async function(next){

    // console.log('this wouldnt show up');
    const hash = await bcrypt.hash(this.senha, 10)
    this.senha = hash;

    next();
} );

module.exports = mongoose.model('User', schema);