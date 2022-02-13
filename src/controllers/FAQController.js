const FAQ = require('../models/FAQ');
const Resposta = require('../_helpers/Resposta');

module.exports ={
    async index(req, res){

        const faq = await  FAQ.find();

        return res.status(200).json( Resposta.send(true, null, faq, null))
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

        if(erros){
            return res.status(422).json( Resposta.send(false, "Erro ao salvar ajuda", null, erros))
            
        }else{
            return res.status(200).json( Resposta.send(true, null, null, null))
        }
    },


    async remove(req, res){

        const faq = await FAQ.deleteOne({_id: req.params.id},(err) => {
            if (err) {
                let erros = err.errors
                return res.status(422).json( Resposta.send(false, "Erro ao remover ajuda", null, erros))
            }

            return res.status(200).json( Resposta.send(true, null, null, null))
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
            return res.status(422).json( Resposta.send(false, "Erro ao alterar ajuda", null, erros))
            
        }else{

            return res.status(200).json( Resposta.send(true, null, null, null))
        }
    },

    async search(req, res){

        const faq = await  FAQ.findOne({_id: req.params.id});

        return res.status(200).json( Resposta.send(true, null, faq, null))
    }

}
