'use strict'
const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    role: String,
    password: String,
    image: String
});

module.exports = Mongoose.model('User', UserSchema);