const Atividade = require('../models/Atividade');
const Mongoose = require('mongoose')
const ObjectId = Mongoose.Types.ObjectId;


module.exports ={
    async index(req, res){
        var atividade = await  Atividade.find();
        var r =JSON.parse(JSON.stringify(atividade));
        return res.json(r);
    },

    async store(req, res){
        const {
                descricao,
                modalidade,
                referencia,
                presencial,
                horasCertificado,
            } = req.body;
            
        let horasConsideradas;
        horasCertificado > 40 ? horasConsideradas = 40 : horasConsideradas = horasCertificado;

        let erros;

        const atividade = await  Atividade.create({
            descricao,
            modalidade,
            referencia,
            presencial,
            horasCertificado,
            horasConsideradas,
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
                message: 'Atividade cadastrada'
            });
        }
    },

    async update(req, res){
        const {
            descricao,
            modalidade,
            referencia,
            presencial,
            horasCertificado,
        } = req.body;


    let horasConsideradas;
    horasCertificado > 40 ? horasConsideradas = 40 : horasConsideradas = horasCertificado;

    let erros;

    let atividade = await  Atividade.findById(req.params.id);

    console.log(atividade)

    await  atividade.updateOne({
        descricao,
        modalidade,
        referencia,
        presencial,
        horasCertificado,
        horasConsideradas,
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
            message: 'Atividade Alterada'
        });
    }
    },

    async remove(req, res){
    
    const atividade = await  Atividade.deleteOne({ _id: req.params.id },(err) => {
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
        message: 'Atividade removida'
    });
   
    },

    async modulos(req, res){
        var consulta = Atividade.aggregate([{
            $match: {
                aluno: ObjectId("5d4ad48d469d2419e445ecd9"),
        
            }
        }, {
            $group: {
        
                _id: '$modalidade',
                soma: {
                    $sum: '$horasConsideradas'
                },
                "presencial": {
                    "$sum": {
                        "$cond": ["$presencial", 1, 0]
                    }
                },
                "distancia": {
                    "$sum": {
                        "$cond": ["$presencial", 0, 1]
                    }
                }
        
            }
        
        }]).exec();
        const horasModulos = {
            modulo1: 0,
            modulo2: 0,
            modulo3: 0,
            presencial: 0,
            total: 0,
        }

        presencial = 0;

        consulta.then(function(result) {
            result.forEach(t => {
                if(t.presencial === 0){
                    // console(t.soma);
                    presencial+=t.soma;
                }

                switch(t._id){
                    case 'I':{
                        if(t.soma)
                            horasModulos.modulo1 = t.soma >= 105 ? 105 : t.soma;
                        break;
                    }
                    case 'II':{
                            horasModulos.modulo2 = t.soma >= 75 ? 75 : t.soma;
                        break;
                    }
                    case 'III':{
                            horasModulos.modulo3 = t.soma >= 75 ? 75 : t.soma;
                        break;
                    }
                }      
            });
            horasModulos.total = horasModulos.modulo1+horasModulos.modulo2+horasModulos.modulo3
            horasModulos.presencial = ((presencial/(150))*100).toFixed(2);
            // console.log(presencial); 
            return res.send (horasModulos);
          })
    },

}
