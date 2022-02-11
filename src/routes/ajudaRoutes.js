const express = require('express');
const authorize = require('../_helpers/authorize')
const Role = require('../_helpers/role');

const routes = new express.Router();
const FAQController = require('../controllers/FAQController');


routes.get('/', FAQController.index )
routes.post('/', authorize(Role.Admin), FAQController.store)
routes.get('/:id', authorize(Role.Admin), FAQController.search)
routes.put('/:id', authorize(Role.Admin), FAQController.update)
routes.delete('/:id', authorize(Role.Admin), FAQController.remove)


module.exports = routes;