const express = require('express');
const router = express.Router();
const auth = require('../.././../middleware/authMiddleware');
const { getBanners, getLatestVideos, getStudyMaterialPdf } = require('../../controller/bannerController');

// Feature Banner  Route
router.route("/api/getBanner").get(auth,getBanners);

//  Latest Videos Route
router.route("/api/getLatestVideos").get(auth,getLatestVideos);

//  Study Material Route
router.route("/api/getStudyMaterail").get(auth,getStudyMaterialPdf);

module.exports = router;