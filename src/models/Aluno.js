const mongoose = require('mongoose');

const AlunosSchema = new mongoose.Schema({
    nome: {
       type: String,
       required: true
    },
    cpf:{
        type: String,
        minlength: 10,
        maxlength:10,
        required: true
     },
     senha: {
      type: String,
      default: ''
    },
    email: {
        type: String,
        required: true
     },
    matriz: {
        type: String,
        required: true
     },
});

AlunosSchema.methods.generateHash = function(senha) {
   return bcrypt.hashSync(senha, bcrypt.genSaltSync(8), null);
};

AlunosSchema.methods.validPassword = function(senha) {
   return bcrypt.compareSync(senha, this.senha);
 };

module.exports = mongoose.model('Alunos', AlunosSchema);