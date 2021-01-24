const Modulo = require('../models/Modulo');

module.exports ={
    async index(req, res){

        const modulo = await  Modulo.find();

        return res.json(modulo);
        
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

            return res.send({
                success: false,
                message: erros
            });
            
        }else{

            return res.send({
                success: true,
                message: 'Modulo cadastrado'
            });
        }
    },


    async remove(req, res){

        const modulo = await Modulo.deleteOne({_id: req.params.id},(err) => {
            if (err) {
                let erros = err.errors

                return res.send({
                    success: false,
                    message: erros
                });

            }
            return res.send({
                success: true,
                message:  'Modulo cadastrado'
            });
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

            return res.send({
                success: false,
                message: erros
            });
            
        }else{
    
            return res.send({
                success: true,
                message: 'Modulo Alterado'
            });
        }
    },

    async getById(req, res){

        const modulo = await  Modulo.findOne({_id: req.params.id});

        return res.json(modulo);
    },

    async storeReferencia(req, res){
        const {nome} = req.body;

        const response = await Modulo.updateOne({_id: req.params.id},  { $push: { atividades: nome } },) 

        return res.send(response)
    },

    async updateReferencia(req, res){
        const {nome, oldNome} = req.body;
     
        await Modulo.updateOne( {_id: req.params.id}, { $pullAll: {atividades: [oldNome] } } )
        const response = await Modulo.updateOne({_id: req.params.id},  { $push: { atividades: nome } },) 
        return res.send(response)

    },

    async removeReferencia(req, res){
        const {nome} = req.body;
       
        const response = await Modulo.updateOne( {_id: req.params.id}, { $pullAll: {atividades: [nome,] } } )
        return res.send(response)

    },



}
