const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
    doucment_link:{ type: String, required: true },
    document_sort: Number,
    title: { type: String, required: true },
    subject: { type: String, required: true },
    status: { type: String, required: false, default: "Inactive"}

},
{ timestamps: true });

module.exports = mongoose.model('studyMaterialPdf',studyMaterialSchema);