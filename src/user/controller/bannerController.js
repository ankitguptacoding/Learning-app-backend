const Banner = require('../../models/Banner');
const Videos = require('../../models/StudyMaterialVideo');
const Pdf = require('../../models/StudyMaterialPdf')
const mongoose = require('mongoose');
var _ = require('lodash');

module.exports = {
    getBanners: async (req, res) => {
        try {
            let response = { "data": [], "status": false, "message": "" };

            let banner_data = await Banner.find();
            if (!_.isEmpty(banner_data)) {

                response.data = banner_data;
                response.status = true;
                response.message = "banner_data Info.";
                
                return res.send(response);
            }

            delete response.data;
            response.status = false;
            response.message = "No banner yet";
            return res.send(response);;


        } catch (error) {
            console.log(error);
            return;
        }
    },
    getLatestVideos: async (req, res) => {
        try {
            let response = { "data": [], "status": false, "message": "" };

            let videos_data = await Videos.find();
            if (!_.isEmpty(videos_data)) {

                response.data = videos_data;
                response.status = true;
                response.message = "videos data Info.";
                
                return res.send(response);
            }

            delete response.data;
            response.status = false;
            response.message = "No Videos yet";
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
    }
}