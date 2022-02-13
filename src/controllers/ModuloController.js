const Modulo = require('../models/Modulo');
const Resposta = require('../_helpers/Resposta');

module.exports ={
    async index(req, res){

        const modulo = await  Modulo.find();

        return res.status(200).json( Resposta.send(true, null, modulo, null)) 
    },

    async store(req, res){
        const {
            nome,
            atividades,
            cargaHorariaMax,
            cargaHorariaMin,
        } = req.body;

        let erros;

        const modulo = await Modulo.create({
            nome,
            atividades,
            cargaHorariaMax,
            cargaHorariaMin,

        },(err) => {
            if (err) {
               erros = err.errors
            }
        });
        // req.io.emit('post',atividade);
        if(erros){

            return res.status(422).json( Resposta.send(false, "Erro ao salvar módulo", null, erros))
        }else{

            return res.status(200).json( Resposta.send(true, null, null, null)) 
        }
    },

    async remove(req, res){

        const modulo = await Modulo.deleteOne({_id: req.params.id},(err) => {
            if (err) {
                let erros = err.errors
                return res.status(422).json( Resposta.send(false, "Erro ao remover módulo", null, erros))

            }else{
    
                return res.status(200).json( Resposta.send(true, null, null, null)) 
            }
        })
    },

    async update(req, res){
      const {
            nome,
            cargaHorariaMax,
            cargaHorariaMin,
        } = req.body;

        let modulo = await  Modulo.findById({_id: req.params.id});

        await modulo.updateOne({
            nome,
            cargaHorariaMax,
            cargaHorariaMin,
        });

        let erros;

        if(erros){
            return res.status(422).json( Resposta.send(false, "Erro ao alterar módulo", null, erros))
        }
    
        return res.status(200).json( Resposta.send(true, null, null, null)) 
            
    },

    async search(req, res){

        const modulo = await  Modulo.findOne({_id: req.params.id});

        return res.status(200).json( Resposta.send(true, null, modulo, null)) 
    },

    async storeReferencia(req, res){
        const {descricao} = req.body;

        const response = await Modulo.updateOne({_id: req.params.id},  { $push: { atividades: descricao } },) 

        return res.status(200).json( Resposta.send(true, null, null, null)) 
    },

    async updateReferencia(req, res){
        const {descricao, descricaoAntiga} = req.body;
     
        await Modulo.updateOne( {_id: req.params.id}, { $pullAll: {atividades: [descricaoAntiga] } } )
        const response = await Modulo.updateOne({_id: req.params.id},  { $push: { atividades: descricao } },) 
        return res.status(200).json( Resposta.send(true, null, null, null)) 
    },

    async removeReferencia(req, res){
        const {descricao} = req.body;
       
        const response = await Modulo.updateOne( {_id: req.params.id}, { $pullAll: {atividades: [descricao,] } } )
        return res.status(200).json( Resposta.send(true, null, null, null)) 

    },



}
