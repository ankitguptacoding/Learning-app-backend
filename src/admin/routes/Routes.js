const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const { uploadFileToS3 }  = require('../../middleware/aws');
const { uploadBanner,  getBanners, updateBanner, deleteBanner } = require('../controller/bannerController');
const { uploadLatestVideos, getLatestVideos, updateLatestVideos, deleteLatestVideos } = require('../controller/videoController');
const { uploadStudyMaterailPdf, getStudyMaterialPdf, updateStudyMaterialPdf, deleteStudyMaterialPdf } = require('../controller/pdfController');

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

// Banner Update Route
router.route("/admin/api/updateBanner").put(auth, uploadFileToS3.single('banner_image'),updateBanner);

// Banner Delete Route
router.route("/admin/api/deleteBanner/id/:id").delete(auth,deleteBanner);

// video Update Route
router.route("/admin/api/updateVideo").put(auth, uploadFileToS3.single('thumb_nail'),updateLatestVideos);

// video Delete Route
router.route("/admin/api/deleteVideo/id/:id").delete(auth,deleteLatestVideos);

// Pdf Update Route
router.route("/admin/api/updatePdf").put(auth, uploadFileToS3.single('doucment'),updateStudyMaterialPdf);

// Pdf Delete Route
router.route("/admin/api/deletePdf/id/:id").delete(auth,deleteStudyMaterialPdf);

module.exports = router;