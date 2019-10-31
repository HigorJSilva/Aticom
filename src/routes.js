const express = require('express');
const multer = require('multer');

const routes = new express.Router();
const upload = multer();

const AtividadeController = require('./controllers/AtividadesController');
const AlunosController = require('./controllers/AlunosController');
const AdminController = require('./controllers/AdminController');


routes.get('/', AtividadeController.index );
routes.post('/new', upload.none(), AtividadeController.store ); 
routes.post('/edit/:id', upload.none(), AtividadeController.update ); 
routes.get('/remove/:id', AtividadeController.remove ); 

routes.get('/:id', AtividadeController.modulos );

routes.get('/perfil', AlunosController.index ); 
routes.post('/alunos/new', AlunosController.store ); 
routes.post('/perfil/:id', AlunosController.update ); 
routes.post('/enviar', AlunosController.enviar ); 


routes.get('/dash', AdminController.index ); 


module.exports = routes;