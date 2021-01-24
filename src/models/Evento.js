const mongoose = require('mongoose');

const EventoSchema = mongoose.Schema({
    imagem:{
        type: String, required: true
    },
    descricao:{
        type: String,
        required: true
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