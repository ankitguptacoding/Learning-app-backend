const express = require('express');
require("dotenv").config();
require('././config/database');
const cors = require('cors');
const router = require('../src/routes/userRoutes/userRoutes');
const routerProduct = require('./routes/productRoutes/productRoutes');
const app = express();
const redisFun = require('../src/redis')
app.use(express.json());
app.use(cors());
console.log("server start")
const redisTest = async()=>{
    await redisFun()
}
//default url 
app.use('/', router,routerProduct);

app.listen(450);