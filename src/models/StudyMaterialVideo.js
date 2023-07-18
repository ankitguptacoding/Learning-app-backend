const mongoose = require('mongoose');

const latestVideoSchema = new mongoose.Schema({
    thumb_nail: { type: String, required: true },
    title: { type: String, required: true },
    video_link: { type: String, required: true },
    description: String,
    video_sort: Number

},
{ timestamps: true });

module.exports = mongoose.model('latest_video',latestVideoSchema);