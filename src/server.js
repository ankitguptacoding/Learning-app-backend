const express = require('express');
require("dotenv").config();
require('././config/database');
const cors = require('cors');
const router = require('./user/routes/userRoutes/userRoutes');
const routerProduct = require('./user/routes/productRoutes/productRoutes');
const routerAdmin = require('./admin/routes/bannerRoutes')
const app = express();
const redisFun = require('../src/redis')
app.use(express.json());
app.use(cors());
console.log("server start")
const redisTest = async()=>{
    await redisFun()
}
//default url 
app.use('/', router, routerAdmin);

app.listen(450);