// require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./utils/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(require('./routes.js'));
// mongoose.connect('mongodb+srv://stockit:senha@cluster0-h5y5e.mongodb.net/'+
// 'test?retryWrites=true&w=majority',{
//     useNewUrlParser:true
// });


// api routes
app.use('/users', require('./users/UserController'));

// global error handler
app.use(errorHandler);


// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
const server = app.listen(3334, function () {
    console.log('Server listening on port ' + port);
});