const mongoose = require('mongoose');

const ModuloSchema = mongoose.Schema({
    nome:{
        type: String, required: true
    },
    atividades:[String],
    cargaHorariaMax:{
        type: String,
        required: true
     },
     cargaHorariaMin:{
        type: String,
        required: true
     },

});
module.exports = mongoose.model('Modulo', ModuloSchema);