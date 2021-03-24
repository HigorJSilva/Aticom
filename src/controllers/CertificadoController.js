const Atividade = require('../models/Atividade');
const User = require('../models/User')
const path = require('path');
const fs = require('fs');
const { templateSettings } = require('lodash');


module.exports ={
    async index(req, res){

        var alunoId = req.params.id
        var atividades = await  Atividade.find({aluno: alunoId});

        var certificados = [];
        atividades.forEach(atividade => {
            var id = atividade._id
            var certificado = atividade.certificado
            certificados.push({id, certificado});

        })
    
        return res.json(certificados);
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
			return res.send({
				success: false,
				message: 'É necessário enviar '+numAtividade+' arquivos, você enviou '+req.files.length
			});
   		}
        const aluno = req.user.sub
        const { form } = req.body;
        const certificados = JSON.parse(form);

	    const user = await User.findOne({_id: aluno})

       await user.updateOne({
           isPendente: true
       })
       
        let erros;
        certificadoWriteFile(req)

        for await (const cert of certificados) {
           
            var atividadeId = cert.atividadeId;
            var certificado = aluno + cert.certificado.replace(/\s+/g, '_');

           const atividade = await Atividade.updateOne({_id: atividadeId}, {
                certificado
            },(err) => {
                if (err) {
                    erros = err.errors
                }
            });
          }

          if(erros){
            return res.send({
                success: false,
                erro: erros
            });
          }
          return res.send({
            success: true,
            message: 'Certificados enviados'
        });

    },

    exibirCertificado(req, res){
        fileName = req.params.id;
        // path.resolve('../','uploads', 'certificados', fileName)
        var data =fs.createReadStream( path.join(__dirname, '../','uploads', 'certificados', fileName));
       
        data.pipe(res);
        // res.contentType("application/pdf");
        // res.send(data);
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
                return res.send({
                    success: false,
                    erro: erros
                });
            }
        });

        return res.send({
            success: true,
            message: 'Certificados removidos'
        });
   
    },


}

function fileUnlink(req){

    req.files.forEach(element => {
        fs.unlinkSync(element.path)
    })
    
}


function certificadoWriteFile(req) {

    var certificado = [];
    req.files.forEach(file => {
        var oldpath = file.path
        console.log('file.path :>> ', file.path);
        console.log('oldpath :>> ', oldpath);
        file.filename = req.user.sub + file.filename 
        certificado.push(file.filename.replace(/\s+/g, '_'));
        // console.log('object :>> ', path.resolve(file.destination, 'certificados', certificado[certificado.length - 1]))


        try {
            // fs.writeFileSync(path.resolve(file.destination, 'certificados', certificado[certificado.length - 1]), file, null);
            fs.renameSync(oldpath,  path.resolve(file.destination, 'certificados', certificado[certificado.length - 1]))   
        // element.mv( path.resolve(element.destination, 'certificados', certificado[certificado.length - 1]))
        }
        catch (e) {
            console.log(e);
        }

    });


    // fileUnlink(req)
}

