const mongoose = require('mongoose');

const Certificados = new mongoose.Schema({
    aluno: { type: mongoose.Schema.Types.ObjectId, ref: 'Alunos' },
    status:{
        type: String,
        default: 'Espera',
        enum: ['Espera','Pendente', 'Completo','Retornado'],
        required: true
     },
    certificado: [{type: String}]
     
});

module.exports = mongoose.model('Certificado', Certificados);