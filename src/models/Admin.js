const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
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
    email: {
        type: String,
        required: true
     },
});

module.exports = mongoose.model('Admin', AdminSchema);