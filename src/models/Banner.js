const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    banner_image: String,
    link: String,
    banner_sort: Number

},
{ timestamps: true });

module.exports = mongoose.model('banner',bannerSchema);