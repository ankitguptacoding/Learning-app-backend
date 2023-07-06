const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    type: String,
    mobile: String,
    otp: Number
},
{ timestamps: true }
);

module.exports = mongoose.model('users',userSchema);