const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
    doucment:{ type: String, required: true },
    link: { type: String, required: true },
    document_sort: Number,
    title: { type: String, required: true },
    subject: { type: String, required: true }

},
{ timestamps: true });

module.exports = mongoose.model('studyMaterialPdf',studyMaterialSchema);