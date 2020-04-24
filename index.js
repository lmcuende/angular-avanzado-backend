'use strict'

const Mongoose = require('mongoose');
var app = require('./app');
const port = process.env.port || 3789;

Mongoose.Promise = global.Promise;

Mongoose.connect('mongodb://localhost:27017/zoo')
        .then(() => {
               console.log('La conexión a la base de datos zoo se ha realizado correctamente...');

               app.listen(port, () => {
                   console.log("El servidor local con Node y Express está corriendo...");
               })
        })
        .catch(err => console.log(err));