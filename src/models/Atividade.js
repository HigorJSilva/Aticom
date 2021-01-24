const mongoose = require('mongoose');

const AtividadeSchema = new mongoose.Schema({
    aluno: { type: mongoose.Schema.Types.ObjectId, ref: 'Alunos' },
    descricao: {
       type: String,
       required:[true,'Campo Drescrição é obrigatório']
    },
    certificado: {
        type: String,
        // default:'undefined'
     },
    modalidade:{
        type: String,
        enum: ['I', 'II','III'],
        required: [true,'Campo modalidade é obrigatório']
     },
    referencia: {
        type: String,
        required: [true,'Campo referência é obrigatório']
     },
    presencial:{
      type: Boolean,
      required: [true,'Campo regime é obrigatório'],
    } ,
    horasCertificado:{
        type: Number,
        required: [true,'Campo hrs. certificado é obrigatório'],
        min: [2,'Não é possível adicionar atividades com menos de duas horas'],
     },
    horasConsideradas:{
        type: Number
     },
     feedback:{
         type: String,
        
     }
});

module.exports = mongoose.model('AtividadeComplementares', AtividadeSchema);