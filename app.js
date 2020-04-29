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
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-requested-With, Content-Type, Accept, Access-Control-Allow-request-Method');
    res.header('access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Rutas base
app.use('/api', user_routes);
app.use('/api', animal_routes);



module.exports = app;