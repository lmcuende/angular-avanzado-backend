'use strict'

const Express = require('express');
var UserController = require('../controllers/user');

var api = Express.Router();
var md_auth = require('../middlewares/authenticate');

api.get('/pruebas-del-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.login);

module.exports = api;