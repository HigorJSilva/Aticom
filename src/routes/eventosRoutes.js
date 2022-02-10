const express = require('express');
const multer = require('multer');
const path = require('path');
const authorize = require('../_helpers/authorize')
const Role = require('../_helpers/role');

const routes = new express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
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


const EventoController = require('../controllers/EventoController');

routes.get('/', authorize(), EventoController.index)
routes.post('/', upload.single('imagem'), authorize([Role.Admin, Role.CA]), EventoController.store );
routes.get('/:id', upload.single('imagem'), authorize( [Role.Admin, Role.CA]), EventoController.search);
routes.put('/:id', upload.single('imagem'), authorize([Role.Admin, Role.CA]), EventoController.update );
routes.delete('/:id', authorize([Role.Admin, Role.CA]), EventoController.remove ); 

module.exports = routes;