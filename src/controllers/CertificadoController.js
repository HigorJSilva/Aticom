const Atividade = require('../models/Atividade');
const Resposta = require('../_helpers/Resposta');

const User = require('../models/User')
const path = require('path');
const fs = require('fs');


module.exports ={
    async index(req, res){

        var atividades = await  Atividade.find({aluno: req.user.sub});
        var certificados = [];

        atividades.forEach(atividade => {
            var id = atividade._id
            var certificado = atividade.certificado
            if(certificado){
                certificados.push({id, certificado});
            }
        })
    
       return res.status(200).json( Resposta.send(true, null, certificados, null))
    },

    async store(req, res){       
       if(req.files.length === 0){
     
			return res.send({
				success: false,
				message: 'Selecione os certificados'
			});
	   }
	   
       const numAtividade = await Atividade.find( { aluno: req.user.sub }).countDocuments()

	   if(req.files.length !== numAtividade ){
            fileUnlink(req)
            res.status(422).json( 
                Resposta.send(
                    false, 
                    "Erro ao salvar feedback", 
                    null, 
                    'É necessário enviar '+numAtividade+' arquivos, você enviou '+req.files.length)
                )
   		}
        const aluno = req.user.sub

        const certificados = req.body.atividadeId

	    const user = await User.findOne({_id: aluno})

       await user.updateOne({
           isPendente: true
       })
       
        let erros;
        certificadoWriteFile(req, certificados)

        for await (const cert of certificados) {
           
            var atividadeId = cert.atividadeId;
            var certificado = cert.certificado.replace(/\s+/g, '_');

           const atividade = await Atividade.updateOne({_id: atividadeId}, {
                certificado
            },(err) => {
                if (err) {
                    erros = err.errors
                }
            });
          }

          if(erros){
            return res.status(422).json( Resposta.send(false, "Erro ao salvar certificado", null, erros))
          }

          return res.status(200).json( Resposta.send(true, null, null, null))

    },

    exibirCertificado(req, res){
        fileName = req.params.id;
        var data =fs.createReadStream( path.join(__dirname, '../','uploads', 'certificados', fileName));
       
        data.pipe(res);

    },

    async search(req, res){

        var certificado = await Atividade.findOne({_id: req.params.id}).where({aluno: req.user.sub});

        data = fs.createReadStream( certificado.certificado);
       
        data.pipe(res);
    },

    async update(req, res){

        const atividade = await Atividade.findOne({ _id: req.params.id }).where({aluno: req.user.sub});
        fs.unlinkSync(atividade.certificado);

        let certificados = [];
        certificados.push(req.body.atividadeId);
        let erros;

        certificadoWriteFile(req, certificados)

        for await (const cert of certificados) {
            var atividadeId = cert.atividadeId;
            var certificado = cert.certificado.replace(/\s+/g, '_');

           const atividade = await Atividade.updateOne({_id: atividadeId}, {
                certificado
            },(err) => {
                if (err) {
                    erros = err.errors
                }
            });
          }

        if(erros){
            return res.status(422).json( Resposta.send(false, "Erro ao alterar certificado", null, erros))
        }

        return res.status(200).json( Resposta.send(true, null, null, null))
    },


    async remove(req, res){

        const atividades = await Atividade.find({ aluno: req.params.id });

        const user = await User.findOne({_id: req.params.id })

       await user.updateOne({
           isPendente: false
       })

        atividades.forEach(element => {
            var filename = req.params.id + element.certificado;
            filename = filename.replace(/\s+/g, '_');
            let filepath = path.join(__dirname, '..', 'uploads', 'certificados', filename)
            fs.unlinkSync(filepath);
            
        });
    
        const atividade = await  Atividade.updateMany({aluno: req.params.id }, {$unset: {certificado: '' }},(err) => {
            if (err) {
                let erros = err.errors
                return res.status(422).json( Resposta.send(false, "Erro ao remover certificado", null, erros)) 
            }
        });

        return res.status(200).json( Resposta.send(true, null, null, null)) 
   
    },


}

function fileUnlink(req){

    req.files.forEach(element => {
        fs.unlinkSync(element.path)
    })
    
}


function certificadoWriteFile(req, certificados) {

    var certificado = [];
    
    req.files.forEach((file ,index) => {
        var oldpath = file.path
        file.filename = req.user.sub + file.filename 
        certificado.push(file.filename.replace(/\s+/g, '_'));

        try {
            let newPath = path.resolve(file.destination, 'certificados', certificado[certificado.length - 1]);
            fs.renameSync(oldpath,  newPath)  
            certificados[index] = {"atividadeId": certificados[index], "certificado": newPath }
           
        }
        catch (e) {
            console.log(e);
        }

    });

}

