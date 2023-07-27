const Banner = require('../../models/Banner');
var _ = require('lodash');

module.exports = {
    uploadBanner: async (req, res,next) => {
        try {
            let response = { "data": [], "status": false, "message": "" };
            const { title } = req.body;
            const banner_image = req.file.location;
            let data = {
                banner_image: banner_image,
                title: title,
                banner_sort: 0,
                
            }
            let banner_data = new Banner(data);
            let result = await banner_data.save();

            if (!_.isEmpty(result)) {

                response.data = result;
                response.status = true;
                response.message = "banner_data Info.";
                
                return res.send(response);
            }

            delete response.data;
            response.status = false;
            response.message = "No banner upload ";
            return res.send(response);;


        } catch (error) {
            console.log(error);
            return;
        }
    },
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
    updateBanner: async (req, res) => {
        try {
            let response = { "data": [], "status": false, "message": "" };
            const { title, _id, banner_sort, status} = req.body;
            console.log("req",req.body)
            const banner_image = req.file && req.file.location ? req.file.location : "";
            let data = {}
            if(banner_image) data.banner_image = banner_image
            if(title) data.title = title
            if(banner_sort) data.banner_sort = banner_sort 
            if(status) data.status = status
            console.log("data",data)
            let result = await Banner.updateOne({
                _id
            },{$set:data});
            
            if (!_.isEmpty(result)) {

                response.data = result;
                response.status = true;
                response.message = "banner updated ";
                
                return res.send(response);
            }

            delete response.data;
            response.status = false;
            response.message = "No banner update ";
            return res.send(response);;


        } catch (error) {
            console.log(error);
            return;
        }
    },
    deleteBanner: async (req, res) => {
        try {
        let id = req.params.id;
        let response = { "status": false, "message": "" };
        console.log("id", id);
        const result = await Banner.deleteOne({ _id: id });
        if (result.deletedCount > 0) {
            response.status = true;
            response.message = "Banner deleted."
            res.send(response);
            return;
        }
        response.status = false;
        response.message = "Banner Already Deleted"
        res.send(response);
        return; 
        } catch (error) {
            console.log(error);
            return;
        }
    }
   
}