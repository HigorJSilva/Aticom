const express = require('express');
const multer = require('multer');
const path = require('path');
const authorize = require('./_helpers/authorize')
const Role = require('./_helpers/role');

const routes = new express.Router();

routes.use('/atividades', authorize([Role.User, Role.CA]), require('./routes/atividadesRoutes'));
routes.use('/eventos', authorize(), require('./routes/eventosRoutes'));
routes.use('/certificados', authorize(Role.User, Role.CA), require('./routes/certificadosRoutes'));
routes.use('/ajuda', require('./routes/ajudaRoutes'));
routes.use('/modulos', require('./routes/modulosRoutes'));
routes.use('/avaliacao', authorize([Role.Admin]), require('./routes/avaliacoesRoutes'));

module.exports = routes;