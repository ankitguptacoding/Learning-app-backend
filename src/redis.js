const redisClient = require('redis');
var redis = redisClient.createClient({
    url: process.env.EXTERNAL_REDIS_URL
});
redis.on("connect", function () {
    console.log("Redis Server connected");
});
 redis.connect();
redis.set('key', '12345');
const fun = async ()=>{
    const value = await redis.get('key');
    console.log("RedisValueTest",value);
}
module.exports = fun()
