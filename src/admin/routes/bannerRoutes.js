const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const { uploadFileToS3 }  = require('../../middleware/aws');
const { uploadBanner, uploadLatestVideos, uploadStudyMaterailPdf, getBanners, getLatestVideos, getStudyMaterialPdf } = require('../controller/bannerController');

// Feature Banner  Route
router.route("/admin/api/uploadBanner").post(auth, uploadFileToS3.single('banner_image'), uploadBanner);

//  Latest Videos Route
router.route("/admin/api/uploadLatestVideos").post(auth,uploadFileToS3.single('thumb_nail'),uploadLatestVideos);

//  Study Material Route
router.route("/admin/api/uploadStudyMaterailPdf").post(auth,uploadFileToS3.single('doucment'),uploadStudyMaterailPdf);

// Feature get Banner  Route
router.route("/admin/api/getBanner").get(auth,getBanners);

//  Latest get Videos Route
router.route("/admin/api/getLatestVideos").get(auth,getLatestVideos);

//  Study get Material Route
router.route("/admin/api/getStudyMaterail").get(auth,getStudyMaterialPdf);

module.exports = router;