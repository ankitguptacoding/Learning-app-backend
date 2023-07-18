

const Pdf = require('../../models/StudyMaterialPdf')

var _ = require('lodash');

module.exports = {
   
    uploadStudyMaterailPdf: async (req, res) => {
        try {
            let response = { "data": [], "status": false, "message": "" };
            const { title, subject } = req.body;
            const doucment = req.file.location;
            let data = {
                doucment: doucment,
                title: title,
                document_sort: 0,
                subject: subject
            }
            let Pdf_data = new Pdf(data);
            let result = await Pdf_data.save();
            
            if (!_.isEmpty(result)) {

                response.data = result;
                response.status = true;
                response.message = "Pdf data Info.";
                
                return res.send(response);
            }

            delete response.data;
            response.status = false;
            response.message = "No pdf Upload";
            return res.send(response);;


        } catch (error) {
            console.log(error);
            return;
        }
    },
    
    getStudyMaterialPdf: async (req, res) => {
        try {
            let response = { "data": [], "status": false, "message": "" };

            let pdf_data = await Pdf.find();
            if (!_.isEmpty(pdf_data)) {

                response.data = pdf_data;
                response.status = true;
                response.message = "pdf data Info.";
                return res.send(response);
            }

            delete response.data;
            response.status = false;
            response.message = "No pdf yet";
            return res.send(response);;


        } catch (error) {
            console.log(error);
            return;
        }
    },

    updateStudyMaterialPdf: async (req, res) => {
        try {
            let response = { "data": [], "status": false, "message": "" };
            const { title, id, document_sort ,subject} = req.body;
            console.log("req",req.body)
            const doucment = req.file && req.file.location ? req.file.location : "";
            let data = {}
            if(doucment) data.doucment = doucment
            if(title) data.title = title
            if(document_sort) data.document_sort = document_sort 
            if(subject) data.subject = subject 
            console.log("data",data)
            let result = await Pdf.updateOne({
                _id: id
            },{$set:data});
            
            if (!_.isEmpty(result)) {

                response.data = result;
                response.status = true;
                response.message = "Pdf updated ";
                
                return res.send(response);
            }

            delete response.data;
            response.status = false;
            response.message = "No Pdf update ";
            return res.send(response);;


        } catch (error) {
            console.log(error);
            return;
        }
    },
    
    deleteStudyMaterialPdf: async (req, res) => {
        try {
        let id = req.params.id;
        let response = { "status": false, "message": "" };
        console.log("id", id);
        const result = await Pdf.deleteOne({ _id: id });
        if (result.deletedCount > 0) {
            response.status = true;
            response.message = "Pdf deleted."
            res.send(response);
            return;
        }
        response.status = false;
        response.message = "Pdf Already Deleted"
        res.send(response);
        return; 
        } catch (error) {
            console.log(error);
            return;
        }
    }
}