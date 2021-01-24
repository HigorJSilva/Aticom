const FAQ = require('../models/FAQ');

module.exports ={
    async index(req, res){

        const faq = await  FAQ.find();

        return res.json(faq);
        
    },

    async store(req, res){
        const {
            titulo,
            resposta
        } = req.body;

        let erros;

        const faq = await FAQ.create({
            titulo,
            resposta

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
                message: 'Pergunta cadastrada'
            });
        }
    },


    async remove(req, res){

        const faq = await FAQ.deleteOne({_id: req.params.id},(err) => {
            if (err) {
                let erros = err.errors

                return res.send({
                    success: false,
                    message: erros
                });

            }
            return res.send({
                success: true,
                message:  'Pergunta excluída'
            });
        })
    },

    async update(req, res){

      const {
            titulo,
            resposta
        } = req.body;

        let faq = await  FAQ.findById(req.params.id);

        await faq.updateOne({
            titulo,
            resposta
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
                message: 'Pergunta Alterada'
            });
        }
    },

    async getById(req, res){

        const faq = await  FAQ.findOne({_id: req.params.id});

        return res.json(faq);
    }



}
