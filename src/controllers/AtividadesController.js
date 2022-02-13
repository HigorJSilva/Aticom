const Atividade = require('../models/Atividade');
const User = require('../models/User');
const Resposta = require('../_helpers/Resposta');

const Mongoose = require('mongoose')
const path = require('path');
const fs = require('fs');

const ObjectId = Mongoose.Types.ObjectId;
const XlsxPopulate = require('xlsx-populate');
const config = require('../config.json');
const enviarEmail = require('../_helpers/EnviarEmail');
const Modulo = require('../models/Modulo');

module.exports ={
    index, store, update, remove,
    search, modulos,
    gerarPlanilha, deletarPlanilha, notificarAluno, concluirAtividades, feedback
};
    async function index(req, res){
        try { 
            var atividades = await  Atividade.find({aluno: req.user.sub});
            return res.status(200).json( Resposta.send(true, null, atividades, null));
            
        } catch (error) {
            return res.status(422).json( Resposta.send(false, null, null, error));
        }

       
    }

    async function store(req, res){
        const {
                descricao,
                modalidade,
                referencia,
                presencial,
                horasCertificado,
            } = req.body;

        const aluno = req.user.sub

        if(descricao === 'undefined' || !modalidade || referencia === 'undefined' || !presencial || !horasCertificado){
            return res.status(422).json( Resposta.send(false, "Todos os campos precisam ser preenchidos", null, null));
        }
    
        if(horasCertificado < 2){
            return res.status(422).json( Resposta.send(false, "Não é possível adicionar atividades com menos de duas horas", null, null));
        }

        let horasConsideradas;
        horasCertificado > 40 ? horasConsideradas = 40 : horasConsideradas = horasCertificado;

        let erros;
        let _id = Mongoose.Types.ObjectId();

        let atividade = await Atividade.create({
            _id,
            aluno,
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
        if(erros){

            return res.status(422).json(Resposta.send(false, "Erros ao cadastrar atividade", null, erros));
            
        }else{
            return res.status(200).json(Resposta.send(true, null, {'id': _id}, null));
        }
    }

    async function update(req, res){
        const {
            descricao,
            modalidade,
            referencia,
            presencial,
            horasCertificado,
        } = req.body;


        let horasConsideradas;
        horasCertificado > 40 ? horasConsideradas = 40 : horasConsideradas = horasCertificado;

        if(!descricao || !modalidade || !referencia || !presencial || !horasCertificado){
            return res.send({ success: false, message:"Todos os campos precisam ser preenchidos"})
        }

        if(horasCertificado < 2){
            return res.send({ success: false, message:"Não é possível adicionar atividades com menos de duas horas"})
        }

        let erros;

        let atividade = await  Atividade.findById(req.params.id);

        await atividade.updateOne({
            descricao,
            modalidade,
            referencia,
            presencial,
            horasCertificado,
            horasConsideradas,
        });

        if(erros){
            res.status(200).json( Resposta.send(false, "Erro ao alterar Atividade", null, erros));

            return res.send({
                success: false,
                message: erros
            });
            
        }else{
            return res.status(200).json( Resposta.send(true, null, atividade, null));

        }
    }

    async function remove(req, res){
    
    const atividade = await  Atividade.deleteOne({ _id: req.params.id },(err) => {
        if (err) {
           return res.status(422).json( Resposta.send(false, 'Erro ao deletar atividade', null, err.errors));
         
        }
    });

    return res.status(200).json( Resposta.send(true, null, null, null));
   
    }

    async function search(req, res){
        try { 
            var atividade = await  Atividade.findById(req.params.id).where({aluno: req.user.sub});
            return res.status(200).json( Resposta.send(true, null, atividade, null));
            
        } catch (error) {
            return res.status(422).json( Resposta.send(true, "Falha ao buscar atividade", null, error));
        }
       
    }

    async function modulos(req, res){

        var consultaHorasPorModulo = Atividade.aggregate([{
            $match: {
                aluno: ObjectId(req.user.sub),
        
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

        const user = await User.findOne({_id: req.user.sub})
        var modulos = await Modulo.find();
        var spec = [];
	
		spec.modulo1 = {'max': (modulos.find(x=> x.nome === "Módulo 1" )).cargaHorariaMax,
						'min':	(modulos.find(x=> x.nome === "Módulo 1" )).cargaHorariaMin }

		spec.modulo2 = {'max': (modulos.find(x=> x.nome === "Módulo 2" )).cargaHorariaMax,
		'min':	(modulos.find(x=> x.nome === "Módulo 2" )).cargaHorariaMin }

		spec.modulo3 = {'max': (modulos.find(x=> x.nome === "Módulo 3" )).cargaHorariaMax,
		'min':	(modulos.find(x=> x.nome === "Módulo 3" )).cargaHorariaMin }

        var cargaHorariaMatriz = (config.matrizes.find(x => x.ano === user.matriz)).cargaHoraria
        
        consultaHorasPorModulo.then(function(result) {
            result.forEach(t => {

                switch(t._id){
                    case 'I':{
                        if(t.soma)
                            horasModulos.modulo1 = t.soma >= cargaHorariaMatriz * (spec.modulo1.max)/100 
                                ? cargaHorariaMatriz * (spec.modulo1.max)/100 : t.soma;
                        break;
                    }
                    case 'II':{
                            horasModulos.modulo2 = t.soma >= cargaHorariaMatriz * (spec.modulo2.max)/100
                                ? cargaHorariaMatriz * (spec.modulo2.max)/100 : t.soma;
                        break;
                    }
                    case 'III':{
                            horasModulos.modulo3 = t.soma >= cargaHorariaMatriz * (spec.modulo3.max)/100
                                ? cargaHorariaMatriz * (spec.modulo3.max)/100 : t.soma;
                        break;
                    }
                }      
            });
        })

        var consultaHorasPresencial = await Atividade.aggregate([
            {
                $match: {
                    aluno: ObjectId(req.user.sub)
                }
                }, {
                $group: {
                    _id: '$presencial', 
                    soma: {
                    $sum: '$horasConsideradas'
                    }
                }
                }
        ]).exec();

        horasPresencial = 0;
        if(consultaHorasPresencial.find(x => x._id === true))
            horasPresencial = consultaHorasPresencial.find(x => x._id === true).soma
        
        horasModulos.total = horasModulos.modulo1+horasModulos.modulo2+horasModulos.modulo3
        horasModulos.presencial = ((horasPresencial/(cargaHorariaMatriz))*100).toFixed(2);
        
        return res.status(200).json( Resposta.send(true, null, horasModulos, null));
    }
    async function gerarPlanilha(req, res,next){

        var atividade = await  Atividade.find({aluno: req.user.sub});

        const user = await User.findById(req.user.sub)

        const {matricula} = req.body

        var letter =  String.fromCharCode(atividade.length+72)
        const range = 'A12:'+letter+(11+atividade.length)
        var matriz = user.matriz.split('/')
        XlsxPopulate.fromFileAsync(path.join(__dirname, '..','files','Atividades_Complementares.xlsm'))
            .then(workbook => {

                const planilha = workbook.sheet("Formulário 2019")
                planilha.cell("F8").value(matriz[0])
                planilha.cell("C6").value(user.nome);
                planilha.cell("C7").value(matricula);
                planilha.range(range).value

                let dados = [];
                atividade.forEach(element => {
                    presencial = element.presencial ? 'P': 'D';
                    dados.push([element.descricao, '', '', '','' ,'','',
                    element.modalidade, element.referencia, presencial,
                    element.horasCertificado ])
                
                });
                var filename = user.nome.replace(/\s+/g, '_');
                planilha.range(range).value(dados);
                fileLocation = path.join(__dirname, '..','uploads','planilhas',filename+'.xlsm')
                workbook.toFileAsync(fileLocation);
               
                return res.send(filename+'.xlsm')

            });


        //  return res.json(atividade);
    }

    async function deletarPlanilha(req, res,next){
        const user = await User.findById(req.user.sub)
        const nome = user.nome.replace(/\s+/g, '_');
        const filepath = path.join(__dirname, '..', 'uploads', 'planilhas', nome)+".xlsm"

        fs.unlinkSync(filepath);
    }

    async function notificarAluno(req, res){
        let alunoId = req.params.id
        const user = await User.findById({_id:alunoId});
        const ativ = await Atividade.find({aluno: alunoId});
        const alunoEmail = user.email

        let atividades = []
        ativ.forEach(atividade => {
            if(atividade.feedback)
                atividades.push({"descricao": atividade.descricao, "feedback": atividade.feedback})
            });
        await Atividade.updateMany({'aluno': alunoId }, {$unset: {'feedback': 1}} )
        enviarEmail.sendMail(alunoEmail,atividades, false).catch(console.error)
        return atividades;
    }

    async function concluirAtividades(req, res){
        let alunoId = req.params.id
        const user = await User.findById({_id:alunoId});
        const alunoEmail = user.email
        await User.updateOne({_id: req.params.id},{isPendente: false, isCompleto: true})

        enviarEmail.sendMail(alunoEmail,null, true).catch(console.error)

        return alunoEmail
    }


    async function feedback(req, res){
         const atividades = await Atividade.find({aluno: req.params.id});
         
         let avaliacao = req.body
        
         var feedbacked = [];

         atividades.forEach(atividade => {
             if(avaliacao[atividade._id]){
                 feedbacked.push(atividade)
                var feedback = avaliacao[atividade._id]
                try{
                    Atividade.findByIdAndUpdate({_id: atividade._id},{
                        feedback
                    },{useFindAndModify: false}).then((result) =>{
                        return res.send({success: true})
                    })
    
                }catch(Exception){
                    console.log('Exception :>> ', Exception);
                }
             }
        });
        notificarAluno(req,res)
        let atividadeComFeedback = await User.updateOne({_id: req.params.id},{isPendente: false})       

        return atividadeComFeedback.ok 
            ? res.status(200).json( Resposta.send(true, null, null, null))
            : res.status(422).json( Resposta.send(true, "Erro ao salvar feedback", null, atividadeComFeedback.errors))
      
    }

