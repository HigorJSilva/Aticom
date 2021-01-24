const mongoose = require('mongoose');

const FaqSchema = mongoose.Schema({
    titulo:{
        type: String,
        required: true
    },
    resposta:{
        type: String,
        required: true
     },
});
module.exports = mongoose.model('FAQ', FaqSchema);