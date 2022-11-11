const mongoose = require("mongoose");

const user = new mongoose.Schema({
    voornaam: String,
    achternaam: String,
    email: String,
    user_uuid: String,
    password_hash: String
})

const users = mongoose.model('Users', user);

module.exports = users