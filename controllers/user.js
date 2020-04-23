'use strict'

// módulos
var bcrypt = require('bcrypt-nodejs');

// modelos
var User = require('../models/user');

// acciones
function pruebas(req, res){
    res.status(200).send({
        message: 'Probando el controlador de usuarios y la acción pruebas...'
    });
}

function saveUser(req, res){
    // Crear objeto de usuario
    var user = new User();

    // Recoger parámetros petición
    var params = req.body;
    

    if (params.password && params.name && params.surname && params.email) {

        // Asignar valores al objeto de usuario
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        User.findOne({email: user.email.toLowerCase()}, (err, issetUser) => {
            if(err){
                res.status(500).send({ message: 'Error al comprobar que el usuario existe'});    
            } else {
                if(!issetUser) {
                    // Cifrar la contraseña
                    bcrypt.hash(params.password, null, null, function(err, hash) {
                        user.password = hash;

                        // Guardar la contraseña
                        user.save((err, userStored) => {
                        if (err){
                            res.status(500).send({ message: 'Error al guardar el usuario'});
                        } else {
                                if(!userStored){
                                    res.status(404).send({ message: 'No se ha registardo el usuario' });
                                } else {
                                    res.status(200).send({ user: userStored });
                                }
                        }
                        });
                    });
                } else {
                    res.status(200).send({
                        message: 'el usuario no puede registrarse'
                   });
                }
            }
        });


    } else {
        res.status(200).send({
             message: 'introduce los datos correctamente para poder registrar al usuario'
        });
   
    }
}

module.exports = {
    pruebas,
    saveUser
};
