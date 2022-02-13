const Evento = require('../models/Evento');
const Resposta = require('../_helpers/Resposta');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports ={
    async index(req, res){
        var evento = await  Evento.find();
        return res.status(200).json( Resposta.send(true, null, evento, null)) 
    },

    async store(req, res){
        const {
                descricao,
                modalidade,
                presencial,
                horasCertificado,
            } = req.body;

        if(descricao.length < 1 || !modalidade || !presencial || !horasCertificado || !req.file){
            return res.status(422).json( Resposta.send(false, "Erro ao salvar evento", null, "Todos os campos precisam ser preenchidos"))
        }
        

        let { filename: imagem } = req.file

      

        imagem = req.user.sub + imagem.replace(/\s+/g, '_')
        let erros;
        console.log('req.file.destination :>> ', req.file.destination);
        sharp(req.file.path)
        .resize(580)
        .toFile(
            path.resolve(req.file.destination, 'eventos', imagem )
            ).then(() =>{
                fs.unlinkSync(req.file.path)
            } );

        
        

        const evento = await  Evento.create({
            imagem,
            descricao,
            modalidade,
            presencial,
            horasCertificado,
        },(err) => {
            if (err) {
               erros = err.errors
            }
        });
        // req.io.emit('post',atividade);
        console.log('evento :>> ', evento);
        if(erros){

            return res.status(422).json( Resposta.send(false, "Erro ao salvar evento", null, erros))
        }else{
            return res.status(200).json( Resposta.send(true, null, evento, null))
        }
    },

    async search(req, res){
        let evento = await  Evento.findById({_id: req.params.id});
        return res.status(200).json( Resposta.send(true, null, evento, null))
    },
    
    async update(req, res){
        const {
            descricao,
            modalidade,
            presencial,
            horasCertificado,
        } = req.body;

        if(descricao.length < 1 || !modalidade || !presencial || !horasCertificado || !req.file){
            return res.status(422).json( Resposta.send(false, "Erro ao alterar evento", null, "Todos os campos precisam ser preenchidos"))
        }

        let { filename: imagem } = req.file 

        imagem =  imagem.replace(/\s+/g, '_')
        
        sharp(req.file.path)
        .resize(580)
        .toFile(
            path.resolve(req.file.destination, 'eventos', imagem )
            ).then(() =>{
                fs.unlinkSync(req.file.path)
            } );

        let erros;
    
        let evento = await  Evento.findById(req.params.id);

        let filepath = path.join(__dirname, '..', 'uploads', 'eventos', evento.imagem)

        fs.unlinkSync(filepath);

        await evento.updateOne({
            imagem,
            descricao,
            modalidade,
            presencial,
            horasCertificado,

            },(err) => {
                if (err) {
                erros = err.errors
                }
            });

        if(erros){
        	return res.status(422).json( Resposta.send(false, "Erro ao alterar evento", null, erros))
            
        }else{
        	return res.status(200).json( Resposta.send(true, null, null, null))
        }
    },

    async remove(req, res){
    
		const eventoImagem = await Evento.findById(req.params.id)

		const evento = await  Evento.deleteOne({ _id: req.params.id },(err) => {
			if (err) {
				let erros = err.errors
				return res.status(422).json( Resposta.send(false, "Erro ao remover evento", null, erros))
			}
		});
		

		const filepath = path.join(__dirname, '..', 'uploads', 'eventos', eventoImagem.imagem)

		fs.unlinkSync(filepath);
		return res.status(200).json( Resposta.send(true, null, null, null))
	},

}
