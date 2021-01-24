const mongoose = require('mongoose');

const Certificados = new mongoose.Schema({
    aluno: { type: mongoose.Schema.Types.ObjectId, ref: 'Alunos' },
    atividade: { type: mongoose.Schema.Types.ObjectId, ref: 'AtividadeComplementares' },
    certificado: {type: String}
     
});

module.exports = mongoose.model('Certificado', Certificados);