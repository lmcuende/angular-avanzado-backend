'use strict'

// módulos
const bcrypt = require('bcrypt');
const fs = require('fs');

const saltRounds = 10;

// modelos
var User = require('../models/user');

// servicios
var jwt = require('../services/jwt');

// acciones
function pruebas(req, res){
    res.status(200).send({
        message: 'Probando el controlador de usuarios y la acción pruebas...',
        user: req.user
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

function login(req, res) {
    var params = req.body;

    var email = params.email.toLowerCase();
    var password = params.password;

    
    User.findOne({ email: email }, (err, user) => {
        if(err){
            res.status(500).send({ message: 'Error al comprobar que el usuario existe'});    
        } else {
            if(user) {
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check == true) {

                        // Comprobar y generar token
                        if (params.gettoken) {
                            // devolver token jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });

                        } else {
                            res.status(200).send({user});
                        }
                        
                    } else {
                        res.status(404).send({
                            message: 'el usuario no ha podido loguearse correctamente'
                        });
                    }
                });
            } else {
                res.status(404).send({
                    message: 'el usuario no ha podido loguearse'
                });
            }
        }
    });

}


function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    if(userId != req.user.sub) {
        return res.status(500).send({
            message: 'No tienes permiso para actualizar el usuario'
        });
    } 
        
    User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
        if(err){
            res.status(500).send({
                message: 'Error al actualizar el usuario'
            });
        } else {
            if(!userUpdated) {
                res.status(404).send({
                    message: 'No se ha podido actualizar el usuario'
                });
            } else {
                res.status(200).send({ user: userUpdated });
            }
        }
    })

}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = "No subido...";

    if(req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split("\/");
        var file_name = file_split[2];


        var ext_split =file_name.split(".");
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {

            if(userId != req.user.sub) {
                return res.status(500).send({
                    message: 'No tienes permiso para actualizar el usuario'
                });
            } 
                
            User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdated) => {
                if(err){
                    res.status(500).send({
                        message: 'Error al actualizar el usuario'
                    });
                } else {
                    if(!userUpdated) {
                        res.status(404).send({
                            message: 'No se ha podido actualizar el usuario'
                        });
                    } else {
                        res.status(200).send({ user: userUpdated, image: file_name });
                    }
                }
            });

        } else {
            fs.unlink(file_path, (err) => {
                if(err) {
                    res.status(200).send({
                        message: 'Extensión no válida y fichero no borrado'
                    });
                } else {
                    res.status(200).send({
                        message: 'La extensión no es válida para una imagen'
                    });
                }
            });
        }
        
    } else {
        res.status(200).send({ message: 'No se han subido ficheros' });
    }
    
}


module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    uploadImage
};
