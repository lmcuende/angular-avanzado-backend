'use strict'

const jwt = require('jwt-simple');
const Moment = require('moment');
const secret = 'clave_secreta_del_curso_de_angular_avanzado';

exports.ensureAuth = function(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(403).send({ message: 'La petición no tiene la cabecera de autenticación'})
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, scret);

        if (payload.exp <= Moment().unix()) {
            return res.status(401).send({
                message: 'El token ha expirado'
            })
        }
    } catch(ex) {
        return res.status(401).send({
            message: 'El token no es válido'
        });
    }

    req.user = payload;

    next();
};
