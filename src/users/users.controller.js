const express = require('express');
const router = express.Router();
const multer = require('multer');
const userService = require('./user.service');
const authorize = require('../_helpers/authorize')
const Role = require('../_helpers/role');


const upload = multer();


// public route
router.post('/authenticate', upload.none(), authenticate);     
router.post('/register', upload.none(), register);         

// admin only
 router.get('/users', /*authorize(Role.Admin),*/ getAll);
 router.get('/userPendente', authorize(Role.Admin), userPendente); 
 router.get('/getUser/:id', authorize(Role.Admin), getById); 

 // user only
 router.post('/alterarSenha', upload.none(), authorize(Role.User), alterarSenha);
 router.post('/alterarDados', upload.none(), authorize(Role.User), alterarDados);
 router.get('/getCompleteStatus', upload.none(), authorize(Role.User), getCompleteStatus);
 router.post('/esquecisenha', upload.none(), esquecisenha);

// all authenticated users
// router.get('/e', authorize(), EventoController.index)

module.exports = router;

async function authenticate(req, res, next) {

    userService.authenticate(req.body)
    .then( user => user ? res.json(user) : res.status(400).json({ message: 'Usuário ou senha  incorreta' }))
    .catch(err => next(err))
}
function register(req, res, next) {
    userService.store(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Erro ao cadastrar' }))
        .catch(err => next(err));
}

async function userPendente(req, res, next) {
    userService.userPendente()
    .then( user => user ? res.json(user) : res.status(400).json({ message: 'Sem registros' }))
    .catch(err => next(err))
}

async function esquecisenha(req, res, next) {
    userService.esquecisenha(req)
    .then( user => user ? res.json(user) : res.status(400).json({ message: 'Sem registros' }))
    .catch(err => next(err))
}

async function alterarSenha(req, res, next) {
    userService.alterarSenha(req)
    .then( user => user ? res.json(user) : res.status(400).json({ message: 'Sem registros' }))
    .catch(err => next(err))
}

async function alterarDados(req, res, next) {
    userService.alterarDados(req)
    .then( user => user ? res.json(user) : res.status(400).json({ message: 'Sem registros' }))
    .catch(err => next(err))
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getById(req, res, next) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);
    // only allow admins to access other user records
    if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getCompleteStatus(req, res, next) {
    const currentUser = req.user.sub;

    userService.getCompleteStatus(currentUser)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}