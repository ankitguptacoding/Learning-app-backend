const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    type: String,
    mobile: String,

});

module.exports = mongoose.model('users',userSchema);