const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const { uploadFileToS3 }  = require('../../middleware/aws');
const { uploadBanner, uploadLatestVideos, uploadStudyMaterailPdf } = require('../controller/bannerController');

// Feature Banner  Route
router.route("/api/uploadBanner").post(auth, uploadFileToS3.single('banner_image'), uploadBanner);

//  Latest Videos Route
router.route("/api/uploadLatestVideos").post(auth,uploadLatestVideos);

//  Study Material Route
router.route("/api/uploadStudyMaterailPdf").post(auth,uploadStudyMaterailPdf);

module.exports = router;