const express = require('express');
const authorize = require('../_helpers/authorize')
const Role = require('../_helpers/role');

const routes = new express.Router();
const ModulosController = require('../controllers/ModuloController');


routes.get('/', ModulosController.index )
routes.post('/', authorize(Role.Admin), ModulosController.store)
routes.get('/:id', authorize(Role.Admin), ModulosController.search)
routes.put('/:id', authorize(Role.Admin), ModulosController.update)

routes.post('/referencias/:id', authorize(Role.Admin),ModulosController.storeReferencia)
routes.put('/referencias/:id', authorize(Role.Admin), ModulosController.updateReferencia)
routes.post('/referencias/:id', authorize(Role.Admin), ModulosController.removeReferencia)

module.exports = routes;