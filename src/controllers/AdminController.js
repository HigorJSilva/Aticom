const Admin = require('../models/Admin');

module.exports ={
    async index(req, res){
        var admin = await  Admin.find();
        var r =JSON.parse(JSON.stringify(admin));
        return res.json(r);
    },
}