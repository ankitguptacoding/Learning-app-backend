const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    mobile: String,
    otp: { type: Number, default: null },
    otpTime: { type: Date, default: null }
    
},
{ timestamps: true }
);

module.exports = mongoose.model('admins',adminSchema);