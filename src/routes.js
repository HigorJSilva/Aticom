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
      const now = new Date().toISOString(); const date = now.replace(/:/g, '-'); 
      cb(null, date + file.originalname);
      // cb(null, filename);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || 
    file.mimetype === 'application/pdf') {

      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });

const AtividadeController = require('./controllers/AtividadesController');
const EventoController = require('./controllers/EventoController');
const CertificadoController = require('./controllers/CertificadoController');


//atividades compl. 

routes.get('/', /*authorize(Role.User),*/ AtividadeController.index );
routes.get('/atividades/:id',/* authorize(Role.Admin),*/ AtividadeController.findByAluno );

routes.post('/new', upload.none(), /*authorize(Role.User),*/ AtividadeController.store ); 
routes.post('/edit/:id', upload.none(), /*authorize(Role.User),*/ AtividadeController.update ); 
routes.get('/remove/:id',/* authorize(Role.User),*/ AtividadeController.remove ); 
routes.get('/modulos',/* authorize(Role.User),*/ AtividadeController.modulos ); 


routes.get('/eventos', authorize(), EventoController.index)
routes.post('/eventos/new', upload.single('imagem'), authorize(), EventoController.store );
routes.get('/eventos/edit/:id', upload.single('imagem'), authorize(Role.Admin), EventoController.findOne);
routes.post('/eventos/edit/:id', upload.single('imagem'), authorize(Role.Admin), EventoController.update );
routes.get('/eventos/remove/:id', authorize(Role.Admin), EventoController.remove ); 

routes.post('/send', upload.any(), /*authorize(Role.User),*/ CertificadoController.store)
routes.get('/get', upload.none(), /*authorize(Role.User),*/ CertificadoController.index)


// routes.get('/useractivities', upload.none(), /*authorize(Role.Admin),*/ EventoController.findOne)
// routes.get('/feedbackactivities', upload.none(), /*authorize(Role.Admin),*/ EventoController.findOne)




module.exports = routes;