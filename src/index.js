// require('rootpath')();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require('./_helpers/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://stockit:senha@cluster0-h5y5e.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser:true
});

// api routes
app.use('/files',express.static(path.resolve(__dirname, 'uploads')));
app.use(require('./routes'));
app.use(require('./users/users.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 3333;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});