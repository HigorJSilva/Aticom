const Certificado = require('../models/Certificado');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');


module.exports ={
    async index(req, res){

        certificado = await  Certificado.find();
        var r =JSON.parse(JSON.stringify(certificado));
        return res.json(r);
    },

    async store(req, res){
        const {
                aluno,
            } = req.body;

        let certificado = []

        req.files.forEach(element => {
            certificado.push(element.filename.replace(/ /g,"_"));

            sharp(element.path)
                .toFile(
                    path.resolve(element.destination, 'certificados', certificado[certificado.length-1] )
                    ).then(() =>{
                        fs.unlinkSync(element.path)
                    } );
        });

        let erros;

        const cert = await Certificado.create({
            aluno,
            certificado

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
                message: 'Certificados cadastrados'
            });
        }
    },

    async update(req, res){
        const {
            aluno,
        } = req.body;

    let certificado = []

    req.files.forEach(element => {
        certificado.push(element.filename.replace(/ /g,"_"));

        sharp(element.path)
            .toFile(
                path.resolve(element.destination, 'certificados', certificado[certificado.length-1] )
                ).then(() =>{
                    fs.unlinkSync(element.path)
                } );
    });


    let erros;

    let cert = await  Certificado.findById(req.params.id);

    let filepath = path.join(__dirname, '..', 'uploads', 'certificados', cert.imagem)

    fs.unlinkSync(filepath);


    await cert.updateOne({
        aluno,
        certificado
        
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
            message: 'Certificados Alterados'
        });
    }
    },

    async remove(req, res){
    
    const certificado = await  Certificado.deleteOne({ _id: req.params.id },(err) => {
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
        message: 'Certificado removido'
    });
   
    },


}
