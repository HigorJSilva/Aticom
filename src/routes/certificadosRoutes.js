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
    }
  });
  
  const fileFilter = (req, file, cb) => {
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

const CertificadoController = require('../controllers/CertificadoController');


routes.get('/', CertificadoController.index)
routes.post('/', upload.any(), CertificadoController.store)
routes.get('/:id', CertificadoController.search)
routes.put('/:id', upload.any(), CertificadoController.update)

routes.delete('/:id', authorize(Role.Admin), CertificadoController.remove)


module.exports = routes;