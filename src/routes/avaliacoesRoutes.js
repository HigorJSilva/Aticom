const express = require('express');
const authorize = require('../_helpers/authorize')
const Role = require('../_helpers/role');

const routes = new express.Router();
const AtividadeController = require('../controllers/AtividadesController');
const CertificadoController = require('../controllers/CertificadoController');

routes.post('/:id', AtividadeController.feedback)
routes.get('/concluir/:id', AtividadeController.concluirAtividades)
routes.post('/corrigir/:id', AtividadeController.notificarAluno)
routes.get('/exibirCertificado/:id', CertificadoController.exibirCertificado)

module.exports = routes;