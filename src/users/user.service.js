const config = require('../config.json');
const User = require('../models/User');
const bcrypt =  require('bcryptjs');
const jwt = require('jsonwebtoken');
const Role = require('../_helpers/role');
const EnviarEmail = require('../_helpers/EnviarEmail');

const users = User.find();

module.exports = {
    authenticate,
    store,
    getAll,
    getById,
    userPendente,
    alterarSenha,
    alterarDados,
    esquecisenha,
    getCompleteStatus
};

async function authenticate(req, res) {
    const {email, senha} = req;

    const user = await User.findOne({email: email})

    if(!user){
        return ({success: false, message: 'Usuário ou senha incorretos'})
    }

    if(! await bcrypt.compare(senha, user.senha))
        return ({success: false, message: 'Usuário ou senha incorretos'})


    if (user) {
        const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
        user.senha = undefined;
        return {
            user,
            token
        };
    }
}

async function store(req, res){
    const {
            nome,
            email,
            senha,
            CPF,
            matriz,
        } = req;
    let role;
    role = (role === "Admincode" ? "Admin" : "User");
    try{
        if( await User.findOne({email}))
            return ({success: false,message: "Email já cadastrado"})

        if( await User.findOne({CPF}))
            return ({success: false, message: "CPF já cadastrado"})       

        const user = await  User.create({
            nome,
            email,
            senha,
            CPF,
            matriz,
            role,
        })

        return ({success: true, message: "Usuário cadastrado"});
    }
    catch(err){
        return ({error: err.errors});
    }

}

async function userPendente( req, res){
    return User.find({isPendente: true});
}

async function esquecisenha( req, res){
    const {email} = req.body
    const aluno = await User.findOne({email: email});

    if(aluno){
        var randomstring = Math.random().toString(36).slice(-8);
        const hash = await bcrypt.hash(randomstring, 10)
        await User.updateOne({ _id: aluno._id }, {senha: hash});

        EnviarEmail.esquecisenha(randomstring,email)
        
        return ({success: true, message: "Senha criada"})
        
    }else{
        return ({success: false, message: "Email não encontrado"})
    }
}

async function alterarSenha( req ){

    const {senhaAtual, novaSenha} = req.body;

    const aluno = await User.findOne({_id: req.user.sub })

    if(! await bcrypt.compare(senhaAtual, aluno.senha))
        return ({success: false, message: 'Senha inserida não conhecide com a senha atual'})

    if ( !(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/.test(novaSenha))){
        return ({success: false, message: 'A senha precisa conter mais de 7 digitos, uma letra maiúscula e um número'})
    }
    else{
        const hash = await bcrypt.hash(novaSenha, 10)

        await aluno.updateOne({senha: hash})
        return ({success: true, message: 'Senha alterada'})
    }

}

async function alterarDados( req ){
    const aluno = await User.findOne({_id: req.user.sub })
    const {nome, CPF, matriz} = req.body;
    const CPFverificado = await User.findOne({CPF})

    if( CPFverificado && !(CPF === aluno.CPF) )
        return ({success: false, message: "CPF já cadastrado"})

    await aluno.update({ nome: nome, CPF: CPF, matriz: matriz })

    return ({success: true, message: 'Dados alterados', data: aluno })

}

async function getAll() {
    return users.map(u => {
        const { senha, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}

async function getById(id) {
    const user = await User.findOne({_id:id}).select('nome matriz')
    if (!user) return;
    return user;
}

async function getCompleteStatus(userId) {
    const user = await User.findOne({_id:userId})
    if (!user) return;
    return user;
}