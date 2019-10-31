const mongoose = require('mongoose');

const AtividadeSchema = new mongoose.Schema({
    aluno: { type: mongoose.Schema.Types.ObjectId, ref: 'Alunos' },
    descricao: {
       type: String,
       required: true
    },
    modalidade:{
        type: String,
        enum: ['I', 'II','III'],
        required: true
     },
    referencia: {
        type: String,
        required: true
     },
    presencial: Boolean,
    horasCertificado:{
        type: Number,
        required: true
     },
    horasConsideradas:{
        type: Number
     },
});

module.exports = mongoose.model('AtividadeComplementares', AtividadeSchema);