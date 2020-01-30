const Evento = require('../models/Evento');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports ={
    async index(req, res){
        var evento = await  Evento.find();
        return res.json(evento);
    },

    async store(req, res){
        const {
                descricao,
                modalidade,
                presencial,
                horasCertificado,
            } = req.body;

        let { filename: imagem } = req.file

        imagem =  imagem.replace(/ /g,"_")
        let erros;
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
        if(erros){

            return res.send({
                success: false,
                message: erros
            });
            
        }else{

            return res.send({
                success: true,
                message: 'Evento cadastrado'
            });
        }
    },

    async findOne(req, res){
        let evento = await  Evento.findById(req.params.id);
        return evento;
    },
    
    async update(req, res){
        const {
            descricao,
            modalidade,
            presencial,
            horasCertificado,
        } = req.body;


        let { filename: imagem } = req.file 

        imagem =  imagem.replace(/ /g,"_")
        
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

    await  evento.updateOne({
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

        return res.send({
            success: false,
            message: erros
        });
        
    }else{

        return res.send({
            success: true,
            message: 'Evento Alterado'
        });
    }
    },

    async remove(req, res){
    
    const eventoImagem = await Evento.findById(req.params.id)

    const evento = await  Evento.deleteOne({ _id: req.params.id },(err) => {
        if (err) {
           let erros = err.errors
          return res.send({
            success: false,
            erro: erros
          });
        }
    });
    

    const filepath = path.join(__dirname, '..', 'uploads', 'eventos', eventoImagem.imagem)

    fs.unlinkSync(filepath);

    return res.send({
        success: true,
        message: 'Evento removido'
    });
   
    },

}
