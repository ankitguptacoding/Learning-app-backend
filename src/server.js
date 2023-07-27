const express = require('express');
require("dotenv").config();
require('././config/database');
const cors = require('cors');
// const logger = require('./utils/logger')(module);
const morgan = require("morgan");
const router = require('./user/routes/userRoutes/userRoutes');
const routerAdmin = require('./admin/routes/Routes');
const routerUserBanner = require('./user/routes/bannerRoutes/bannerRoutes');
const bodyParser = require("body-parser");
const app = express();
const redisFun = require('../src/redis')
const port = 450;
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(cors({
    "origin": "*"
}))
const redisTest = async()=>{
    await redisFun()
}
//default url 
app.use('/', router, routerAdmin,routerUserBanner);

var server = app.listen(port, () => console.log(`Server is listening on :${port}`));
