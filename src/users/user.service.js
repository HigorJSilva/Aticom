const config = require('../config.json');
const User = require('../models/User');
const bcrypt =  require('bcryptjs');
const jwt = require('jsonwebtoken');
const Role = require('../_helpers/role');


const users = User.find();

module.exports = {
    authenticate,
    store,
    getAll,
    getById
};

async function authenticate(req, res) {
    const {CPF, senha} = req;
    const user = await User.findOne({CPF})
        
    if(!user){
        return ({message: 'Usuário não encontrado'})
    }

    if(! await bcrypt.compare(senha, user.senha))
        return ({message: 'Usuário ou senha incorretos'})


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
        } = req;
    let role;
    role = (role === "Admincode" ? "Admin" : "User");

    try{
        if( await User.findOne({email}))
            return ({message: "Email já cadastrado"})

        if( await User.findOne({CPF}))
            return res.status(400).send({message: "CPF já cadastrado"})       

        const user = await  User.create({
            nome,
            email,
            senha,
            CPF,
            role,
        })

        return ({message: "Usuário cadastrado"});
    }
    catch(err){
        return ({error: err.errors});
    }

}


async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}

async function getById(id) {
    const user = users.find(u => u.id === parseInt(id));
    if (!user) return;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}