'use strict'

const Express = require('express');
var UserController = require('../controllers/user');

var api = Express.Router();

api.get('/pruebas-del-controlador', UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.login);

module.exports = api;