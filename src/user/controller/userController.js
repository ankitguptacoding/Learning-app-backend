const User = require('../../models/User');
const mongoose = require('mongoose');
var _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const key = process.env.JWT_KEY;

module.exports = {

    userLogin: async (req, res) => {
        const { email, password } = req.body;
        console.log("req.body", req.body);
        let response = { "data": [], "status": false, "message": "" }
        if (!_.isEmpty(email) && !_.isEmpty(password)) {

            let data = await User.findOne({
                email: email

            })
            if(data == undefined){
                delete response.data;
                response.message = "worng Email or Password"
                return res.send(response);
            }

            const match =  bcrypt.compareSync(password, data.password);
            console.log("match",match);
            if (!match) {
                delete response.data;
                response.message = "worng Email or Password"
                return res.send(response);
            }
            else {
                let token_data = {
                    "email":data.email,
                    "name": data.name,
                    "type": data.type
                }
                console.log("data_token",data);
                let token = jwt.sign({ token_data }, key, { expiresIn: "24h" });
                console.log("token",token);
                response.data = data;
                response.status = true;
                response.message = "sucessfully login";
                response.auth = token;
                return res.send(response);

            }
        }else{
            delete response.data;
            response.message = "fill Email & Password"
            return res.send(response);
        }
    },

    userSignUp: async (req, res) => {
        console.log("hii");
        let data = { "result": [], "status": false, "message": "Registernation Failed" };
        const { name, email, mobile, password } = req.body;
       
        try {

            // Validate user input
            if (!name || !email || !password || !mobile ) {
                
                return res.status(400).json({ message: 'All fields are required' });
            }
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                
                return res.status(409).send({ message: 'User already exists' });
            }
            // Hash password
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create new user
            const newUser = new User({ name, email, password: hashedPassword, mobile ,type: "user"});
            await newUser.save();

            // Create token 
            const token = jwt.sign({ name, email }, key, { expiresIn: "24h" });

            if (token) {

                //Create response
                data.status = true;
                data.message = "successfully";
                data.result = newUser;
                data.auth = token;
                res.status(201).json(data);
                return;
            }
            return res.status(400).json(data);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    userList: async (req, res) => {
        try {
            let response = { "data": [], "status": false, "message": "" };

            let userData = await User.find().select("-password");
            if (!_.isEmpty(userData)) {

                response.data = userData;
                response.status = true;
                response.message = "sucessfully All User Info.";
                res.send(response);
                return;
            }

            delete response.data;
            response.status = false;
            response.message = "No User yet";
            res.send(response);
            return;


        } catch (error) {
            console.log(error);
        }
    },

    userProfileUpdate: async (req, res) => {
        try {

            let id = req.params.id;
            console.log("req",req.body);
            const { email} = req.body;
            let response = { "data": [], "status": false, "message": "" };
            if (!mongoose.Types.ObjectId.isValid(id)) {
                delete response.data;
                response.message = "Wrong Product Id ."
                res.send(response);
                return;
            }
            else {
                console.log("email",email);
                const emailCheck = await User.find({email: email});
                console.log("emailCheck",emailCheck[0]);
                let emailCheck_id = emailCheck && emailCheck[0]!=undefined ? emailCheck[0].id : ""
                if(emailCheck_id != id && !_.isEmpty(emailCheck))  {
                    response.status = false;
                    response.message = "Email Already Exists."  
                    return  res.send(response);
                }else {

                    const userData = await User.updateOne({ _id: id }, {
                        $set: req.body
                    });
                    response.data = userData;
                    if (userData.modifiedCount > 0) {
                        response.data = userData;
                        response.status = true;
                        response.message = "User  Updated."
                        return res.send(response);
                        
                    } else {
                        response.status = false;
                        response.message = "User Already Up to date."
                        return res.send(response);
                        
                    }
                }
               
            }
        } catch (error) {
            console.log(error);
        }


    },

    getUserInfo: async (req,res)=>{
        const id = req.params.id;
        let response = { "data": [], "status": false, "message": "Empty Or Wrong Id" }
        try {
           if(!_.isEmpty(id)) {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                delete response.data;
                return res.send(response);
            }
            let userInfo = await User.findOne({_id:id}).select("-password");
            if(userInfo!= undefined) {
                response.data = userInfo;
                response.status = true;
                response.message = "User Info";
                return res.send(response);
            }
           }
                delete response.data;
                return res.send(response);
           
        } catch (error) {
            console.log(error);
        }
    }
}