const mongoose = require('mongoose');

const latestVideoSchema = new mongoose.Schema({
    thumb_nail: { type: String, required: true },
    link: { type: String, required: true },
    title: { type: String, required: true },
    description: String

},
{ timestamps: true });

module.exports = mongoose.model('latest_video',latestVideoSchema);