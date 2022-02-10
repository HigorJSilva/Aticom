const express = require('express');

const authorize = require('../_helpers/authorize')
const Role = require('../_helpers/role');

const routes = new express.Router();

const AtividadeController = require('../controllers/AtividadesController');

routes.get('/', AtividadeController.index );
routes.post('/', AtividadeController.store ); 
routes.get('/:id', AtividadeController.search );
routes.put('/:id', AtividadeController.update ); 
routes.delete('/:id', AtividadeController.remove ); 

routes.get('/modulos', authorize([Role.User, Role.CA]), AtividadeController.modulos );
routes.post('/gerarPlanilha', authorize([Role.User, Role.CA]), AtividadeController.gerarPlanilha );
routes.get('/deletarPlanilha', authorize([Role.User, Role.CA]), AtividadeController.deletarPlanilha );


module.exports = routes;