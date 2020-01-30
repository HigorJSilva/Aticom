const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const authorize = require('../_helpers/authorize')
const Role = require('../_helpers/role');


// router.use(routes)

// public route
router.post('/authenticate', authenticate);     
router.post('/register', register);     

// admin only
 router.get('/users', authorize(Role.Admin), getAll);



// all authenticated users
// router.get('/e', authorize(), EventoController.index)

module.exports = router;

async function authenticate(req, res, next) {
    userService.authenticate(req.body)
    .then( user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
    .catch(err => next(err))
}
function register(req, res, next) {
    userService.store(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Erro ao cadastrar' }))
        .catch(err => next(err));
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