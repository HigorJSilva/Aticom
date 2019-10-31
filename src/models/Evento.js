const mongoose = require('mongoose');

const EventoSchema = mongoose.Schema({
    imagem:{
        type: String
    },
    descricao:{
        type: String
    },
    modalidade:{
        type: String,
        enum: ['I', 'II','III'],
        required: true
     },
    presencial: Boolean,
    horasCertificado:{
        type: Number,
        required: true
     },
});
module.exports = mongoose.model('Eventos', EventoSchema);