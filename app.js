'use strict'

const Express = require('express');
const BodyParser = require('body-parser');

var app = Express();

// cargar rutas
const user_routes = require('./routes/user');
const animal_routes = require('./routes/animal');

// middlewares de body-parser
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));


// Configurar cabeceras y cors

// Rutas base
app.use('/api', user_routes);
app.use('/api', animal_routes);



module.exports = app;