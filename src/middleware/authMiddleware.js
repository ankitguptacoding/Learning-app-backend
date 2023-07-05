const jwt = require('jsonwebtoken');
const key = process.env.JWT_KEY;

const auth = async(req,res,next)=>{

    var token = req.headers.authorization;
    if(token) {
        jwt.verify(token ,key,(err, decoded)=>{
            if(err){
                console.log("er",err);
                console.log("token",token);
               return res.send({sucess:false,message: "Failed to authenticate user."})
            } else {
                req.decoded = decoded;
                console.log("req.decoded",req.decoded);
                next();
            }
        })
    } else {
      return  res.status(403).send({sucess:false,message: "No Token Provided."});
    }

}

module.exports= auth;