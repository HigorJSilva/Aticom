const express = require('express');
const multer = require('multer');
const path = require('path');
const authorize = require('./_helpers/authorize')
const Role = require('./_helpers/role');

const routes = new express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '/uploads/'));
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
      // cb(null, filename);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || 
    file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {

      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter
  });

const AtividadeController = require('./controllers/AtividadesController');
const EventoController = require('./controllers/EventoController');
const CertificadoController = require('./controllers/CertificadoController');
const FAQController = require('./controllers/FAQController');
const ModuloController = require('./controllers/ModuloController');


//atividades compl. 

routes.get('/', authorize([Role.User, Role.CA]), AtividadeController.index );
routes.get('/atividades/:id', authorize(Role.Admin), AtividadeController.findByAluno );

routes.post('/new', upload.none(), authorize([Role.User, Role.CA]), AtividadeController.store ); 
routes.post('/edit/:id', upload.none(), authorize([Role.User, Role.CA]), AtividadeController.update ); 
routes.get('/remove/:id', authorize([Role.User, Role.CA]), AtividadeController.remove ); 
routes.get('/modulos', authorize([Role.User, Role.CA]), AtividadeController.modulos );
routes.post('/gerarPlanilha', upload.none(), authorize([Role.User, Role.CA]), AtividadeController.gerarPlanilha );
routes.get('/deletarPlanilha', authorize([Role.User, Role.CA]), AtividadeController.deletarPlanilha );

routes.get('/eventos', authorize(), EventoController.index)
routes.post('/eventos/new', upload.single('imagem'), authorize([Role.Admin, Role.CA]), EventoController.store );
routes.get('/eventos/edit/:id', upload.single('imagem'), authorize( [Role.Admin, Role.CA]), EventoController.findOne);
routes.post('/eventos/edit/:id', upload.single('imagem'), authorize([Role.Admin, Role.CA]), EventoController.update );
routes.get('/eventos/remove/:id', authorize([Role.Admin, Role.CA]), EventoController.remove ); 

routes.get('/certificados/:id', upload.none(), authorize(Role.User, Role.CA), CertificadoController.index)
routes.post('/certificados/send', upload.any(), authorize(Role.User, Role.CA), CertificadoController.store)
routes.get('/certificados/remove/:id', upload.none(), authorize(Role.Admin, Role.CA), CertificadoController.remove)

routes.get('/ajuda', upload.none(), FAQController.index )
routes.post('/ajuda/new', upload.none(), authorize(Role.Admin), FAQController.store)
routes.get('/ajuda/edit/:id', upload.none(), authorize(Role.Admin), FAQController.getById)
routes.post('/ajuda/edit/:id', upload.none(), authorize(Role.Admin), FAQController.update)
routes.get('/ajuda/remove/:id', upload.none(), authorize(Role.Admin), FAQController.remove)

routes.get('/modulo', authorize(), ModuloController.index )
routes.post('/modulos/create/', upload.none(), authorize(Role.Admin), ModuloController.store)
routes.post('/modulos/edit/:id', upload.none(), authorize(Role.Admin), ModuloController.update)
routes.get('/modulos/edit/:id', upload.none(), authorize(Role.Admin), ModuloController.getById)
routes.get('/modulos/remove/:id', upload.none(), authorize(Role.Admin), ModuloController.remove)

routes.post('/modulos/addref/:id', upload.none(), authorize(Role.Admin), ModuloController.storeReferencia)
routes.post('/modulos/editref/:id', upload.none(), authorize(Role.Admin), ModuloController.updateReferencia)
routes.post('/modulos/removeref/:id', upload.none(), authorize(Role.Admin), ModuloController.removeReferencia)

routes.post('/avaliacao/:id', upload.none(), authorize(Role.Admin), AtividadeController.feedback)
routes.get('/avaliacao/concluir/:id', upload.none(), authorize(Role.Admin), AtividadeController.concluirAtividades)
routes.get('/avaliacao/corrigir/:id', upload.none(), authorize(Role.Admin), AtividadeController.notificarAluno)

module.exports = routes;