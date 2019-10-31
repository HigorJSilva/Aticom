const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const cors = require('cors');

const app = express();
app.use(
    bodyParser.urlencoded({
      extended: true
    })
  )

const server = require('http').Server(app);
// const io = require('socket.io')(server);

mongoose.connect('mongodb+srv://stockit:senha@cluster0-h5y5e.mongodb.net/'+
'test?retryWrites=true&w=majority',{
    useNewUrlParser:true
});


  app.use(cors());

// app.use((req,res,next)=>{
//     req.io = io;
//     next();
// });

app.use(require('./routes.js'));

server.listen(3333);