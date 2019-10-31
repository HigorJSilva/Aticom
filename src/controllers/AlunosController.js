const Aluno = require('../models/Aluno');

module.exports ={
    async index(req, res){
        var aluno = await  Aluno.find();
        var r =JSON.parse(JSON.stringify(aluno));
        return res.json(r);
    },

    async enviar(req, res){
        return res.send({
            success: true,
            message: 'Atividades enviadas'
        });
    },

    async store(req, res){
        const {
            nome,
            email,
            cpf,
            matriz,
        } = req.body;

        aluno = await  Aluno.create({
            nome,
            email,
            cpf,
            matriz
        },(err) => {
            if (err) {
               let erros = err.errors
              return res.send({
                success: false,
                erro: erros
              });
            }
        });
        return res.send({
            success: true,
            message: 'Dados alterados'
        });

    },

    async update(req, res){
        const {
            nome,
            email,
            cpf,
            matriz,
        } = req.body;
        
        let aluno = await  Aluno.findById(req.params.id);

        aluno = await  Aluno.updateOne({
            nome,
            email,
            cpf,
            matriz
        },(err) => {
            if (err) {
               let erros = err.errors
              return res.send({
                success: false,
                erro: erros
              });
            }
        });
        return res.send({
            success: true,
            message: 'Dados alterados'
        });
    },

}
