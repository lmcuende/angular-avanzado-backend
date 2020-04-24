'use strict'

const Jwt = require('jwt-simple');
const Moment = require('moment');
const secret = 'clave_secreta_del_curso_de_angular_avanzado';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: Moment().unix,
        exp: Moment().add(30, 'days').unix
    };

    return Jwt.encode(payload, secret);

};