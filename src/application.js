const  express = require( 'express')
const  bodyParser = require( 'body-parser')
const  cors = require( 'cors')
const  dotenv = require( 'dotenv')

const path = require('path');

const errorHandler = require('./_helpers/error-handler');

dotenv.config()

const application = express()

application.use(bodyParser.urlencoded({ extended: false }));
application.use(bodyParser.json());
application.use(cors());

application.use('/files',express.static(path.resolve(__dirname, 'uploads')));
application.use(require('./users/users.controller'));
application.use(require('./routes'));


application.use(errorHandler);

application.set('port', process.env.APP_PORT || 5000)

module.exports =  application