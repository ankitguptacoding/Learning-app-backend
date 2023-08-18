const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    mobile: String,
    otp: { type: Number, default: null },
    isEmailVerify: { type: Boolean, default: false },
    otpTime: { type: Date, default: null },
    token: String,
    image: String
    
},
{ timestamps: true }
);

module.exports = mongoose.model('users',userSchema);