
const Videos = require('../../models/StudyMaterialVideo');
var _ = require('lodash');

module.exports = {
   
    uploadLatestVideos: async (req, res) => {
        try {
            let response = { "data": [], "status": false, "message": "" };
            const { title, description, videoLink } = req.body;
            const thumb_nail = req.file.location;
            let data = {
                thumb_nail: thumb_nail,
                title: title,
                description: description,
                videoLink: videoLink
            }
            let video_data = new Videos(data);
            let result = await video_data.save();
            
            if (!_.isEmpty(result)) {

                response.data = result;
                response.status = true;
                response.message = "video data Info.";
                
                return res.send(response);
            }

            delete response.data;
            response.status = false;
            response.message = "No video upload";
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

    updateLatestVideos: async (req, res) => {
        try {
            let response = { "data": [], "status": false, "message": "" };
            const { title, id, video_sort, videoLink, description } = req.body;
            console.log("req",req.body)
            const thumb_nail = req.file && req.file.location ? req.file.location : "";
            let data = {}
            if(thumb_nail) data.thumb_nail = thumb_nail
            if(title) data.title = title
            if(video_sort) data.video_sort = video_sort 
            if(videoLink) data.videoLink = videoLink
            if(description) data.description = description  
            console.log("data",data)
            let result = await Videos.updateOne({
                _id: id
            },{$set: data});
            
            if (!_.isEmpty(result)) {

                response.data = result;
                response.status = true;
                response.message = "Videos updated ";
                
                return res.send(response);
            }

            delete response.data;
            response.status = false;
            response.message = "No Videos update ";
            return res.send(response);;


        } catch (error) {
            console.log(error);
            return;
        }
    },

    deleteLatestVideos: async (req, res) => {
        try {
        let id = req.params.id;
        let response = { "status": false, "message": "" };
        console.log("id", id);
        const result = await Videos.deleteOne({ _id: id });
        if (result.deletedCount > 0) {
            response.status = true;
            response.message = "Videos deleted."
            res.send(response);
            return;
        }
        response.status = false;
        response.message = "Videos Already Deleted"
        res.send(response);
        return; 
        } catch (error) {
            console.log(error);
            return;
        }
    }
    
}