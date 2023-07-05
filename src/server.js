const express = require('express');
require("dotenv").config();
require('././config/database');
const cors = require('cors');
const router = require('../src/routes/userRoutes/userRoutes');
const routerProduct = require('./routes/productRoutes/productRoutes');
const app = express();
const redis = require('redis');
const redisClient = redis.createClient(6379,'0.0.0.1');
redisClient.connect()
redisClient.on("connect",(err)=>{
console.log("redis connect");
})

app.use(express.json());
app.use(cors());
console.log("server start")
//default url 
app.use('/', router,routerProduct);

app.listen(450);