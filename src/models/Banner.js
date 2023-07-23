const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    banner_image: String,
    title: String,
    banner_sort: Number,
    status: { type: String, required: false, default: "Inactive"}

},
{ timestamps: true });

module.exports = mongoose.model('banner',bannerSchema);