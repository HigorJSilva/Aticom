const User = require('../models/User');
const Mongoose = require('mongoose')
const ObjectId = Mongoose.Types.ObjectId;


module.exports ={
    async index(req, res){
        var user = await  User.find();
        console.log(user);
        return res.json(user);
    },

    async store(req, res){
        const {
                nome,
                email,
                senha,
                CPF,
            } = req.body;
            console.log(req.body)

        let role;
        role = (req.body.role === "Admincode" ? "Admin" : "User");

        try{
            if( await User.findOne({email}))
                return res.status(400).send("Email já cadastrado")

            if( await User.findOne({CPF}))
                return res.status(400).send("CPF já cadastrado")


            const user = await  User.create({
                nome,
                email,
                senha,
                CPF,
                role,
            })
        }
        catch(err){
            return res.status(400).send({error: err});
        }

        return res.send({message: 'Usuario registrado'});
    }
}