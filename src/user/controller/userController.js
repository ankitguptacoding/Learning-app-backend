const User = require("../../models/User");
const mongoose = require("mongoose");
const validater = require("../../middleware/validation/userValidation");
const { body, validationResult } = require("express-validator");
var _ = require("lodash");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const bcrypt = require("bcrypt");
const { sendVerificationEmailResetPwd } = require("../../middleware/email");
const saltRounds = 10;
const key = process.env.JWT_KEY;

module.exports = {
  userLogin: async (req, res) => {
    let response = { data: [], status: false, message: "" };
    const { email, password } = req.body;
    try {
      if (!_.isEmpty(email) && !_.isEmpty(password)) {
        let data = await User.findOne({
          email: email,
        }).lean();
        if (data == undefined) {
          delete response.data;
          response.message = "Worng Email ";
          return res.send(response).status(403);
        }

        const match = bcrypt.compareSync(password, data.password);

        if (!match) {
          delete response.data;
          response.message = "Wrong Password ";
          return res.send(response).status(403);
        } else {
          let token_data = {
            email: data.email,
            name: data.name,
          };

          let token = jwt.sign({ token_data }, key, { expiresIn: "24h" });
          const token_expire_time = moment().add(1, 'days').format("YYYY-MM-DD LTS");
          await User.updateOne(
            { email: email },
            {
              $set: {
                token: token
              },
            }
          );
          delete data.password;
          delete data.token;
          response.data = data;
          response.status = true;
          response.message = "sucessfully login";
          response.auth = token;
          response.token_expire_time = token_expire_time
          return res.send(response).status(200);
        }
      } else {
        delete response.data;
        response.message = "fill Email & Password";
        return res.send(response).status(404);
      }
    } catch (error) {
      delete response.data;
      response.message = "Internal server error";
      return res.status(500).send(response);
    }
  },

  userSignUp: async (req, res) => {
    let response = { data: [], status: false, message: "" };
    const { name, email, mobile, password } = req.body;
    try {
      // Validate user input
      validater.validateUser(req, res);
      const errors = validationResult(req);

      if (!_.isEmpty(errors.array())) {
        delete response.data;
        response.message = "All fields are required with correct information";
        response.error = errors.array();
        return res.status(400).send(response);
        // return res.status(400).json({ errors: errors.array() });
      }

      // Validate user input
      if (!name || !email || !password || !mobile) {
        delete response.data;
        response.message = "All fields are required";
        return res.status(400).send(response);
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        delete response.data;
        response.message = "User already exists";
        return res.status(409).send(response);
      }
      // Hash password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create token
        const token = jwt.sign({ name, email }, key, { expiresIn: "24h" });
        const token_expire_time = moment().add(1, 'days').format("YYYY-MM-DD LTS");

      // Create new user
      const newUser = {
        name,
        email,
        password: hashedPassword,
        mobile,
        isEmailVerify: false,
        token : token
      };
      await User.create(newUser);
    
      //Create response
      if (token) {
        delete newUser.password;
        delete newUser.token;
        response.status = true;
        response.message = "successfully";
        response.data = newUser;
        response.auth = token;
        response.token_expire_time = token_expire_time
        return res.status(200).send(response);
      }
      delete response.data;
      response.message = "token generate error";
      return res.status(400).send(response);
    } catch (error) {
      console.log(error);
      delete response.data;
      response.message = "Internal server error";
      return res.status(500).send(response);
    }
  },

  userList: async (req, res) => {
    let response = { data: [], status: false, message: "" };
    try {
      //Find All User
      let userData = await User.find().select("-password").lean();
      if (!_.isEmpty(userData)) {
        response.data = userData;
        response.status = true;
        response.message = "sucessfully All User Info.";
        return res.send(response).status(200);
      }

      delete response.data;
      response.message = "No User yet";
      return res.send(response).status(404);
    } catch (error) {
      console.log(error);
      delete response.data;
      response.message = "Internal server error";
      return res.status(500).send(response);
    }
  },

  userProfileUpdate: async (req, res) => {
    let response = { data: [], status: false, message: "" };
    let id = req.params.id;
    const { email, name, mobile } = req.body;

    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        delete response.data;
        response.message = "Wrong user Id .";
        return res.send(response).status(404);
      } else {
        const emailCheck = await User.find({ email: email });
        
        let email_user_id =
          emailCheck && emailCheck[0] != undefined ? emailCheck[0].id : "";
        if (email_user_id != id && !_.isEmpty(emailCheck)) {
          delete response.data;
          response.status = false;
          response.message = "Email Already Exists.";
          return res.send(response).status(403);
        } else {
          let userUpDt = {};
          const image = req.file && req.file.location ? req.file.location : "";
          if (image) userUpDt.image = image;
          if (email) userUpDt.email = email;
          if (name) userUpDt.name = name;
          if (mobile) userUpDt.mobile = mobile;
          const userData = await User.updateOne(
            { _id: id },
            {
              $set: userUpDt,
            }
          );
          response.data = userData;
          if (userData.modifiedCount > 0) {
            response.data = userData;
            response.status = true;
            response.message = "User  Updated.";
            return res.send(response).status(200);
          } else {
            delete response.data;
            response.message = "User Already Up to date.";
            return res.send(response).status(403);
          }
        }
      }
    } catch (error) {
      delete response.data;
      response.message = "Internal server error";
      return res.send(response).status(403);
    }
  },

  getUserInfo: async (req, res) => {
    const id = req.params.id;
    let response = { data: [], status: false, message: "" };
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        delete response.data;
        response.message = "wrong ID";
        return res.send(response).status(404);
      }
      let userInfo = await User.findOne({ _id: id }).select("-password");
      if (userInfo != undefined) {
        response.data = userInfo;
        response.status = true;
        response.message = "User Info";
        return res.send(response).status(200);
      }
      delete response.data;
      response.message = "User Not Found";
      return res.send(response).status(200);
    } catch (error) {
      console.log(error);
      delete response.data;
      response.message = "Internal server error";
      return res.send(response).status(500);
    }
  },

  forgotPassword: async (req, res) => {
    let response = { data: [], status: false, message: "" };
    try {
      const { email } = req.body;
      if (!_.isEmpty(email)) {
        let data = await User.findOne({
          email: email,
        }).select("-password");
        console.log("data", data);
        if (data == undefined || data == null || data == "") {
          delete response.data;
          response.message = "worng Email";
          return res.send(response).status(404);
        }
        var otp = Math.floor(1000 + Math.random() * 9000);
        var currTime = moment().format("YYYY-MM-DD HH:mm:ss");
        console.log("otp", otp);
        if (otp.toString().length >= 4) {
          const userData = await User.updateOne(
            { email: email },
            {
              $set: {
                otp: otp,
                otpTime: currTime,
              },
            }
          );
          if (userData.modifiedCount) {
            let sendResult = await sendVerificationEmailResetPwd(email, otp);
            if (sendResult.messageId) {
              delete response.data;
              response.status = true;
              response.message = "otp Send To your Email";
              return res.status(200).send(response);
            } else {
              delete response.data;
              response.message = "Email Service Unavailable";
              return res.status(503).send(response);
            }
          }
        }
      } else {
        delete response.data;
        response.message = "fill Email & Password";
        return res.send(response).status(400);
      }
    } catch (error) {
      delete response.data;
      response.message = "Internal server error";
      return res.send(response).status(500);
    }
  },

  changePassword: async (req, res) => {
    let response = { data: [], status: false, message: "" };
    try {
      const { email, oldPassword, newPassword } = req.body;
      console.log(!_.isEmpty(email), !_.isEmpty(oldPassword), !_.isEmpty(newPassword));
      if (
        !_.isEmpty(email) &&
        !_.isEmpty(oldPassword) &&
        !_.isEmpty(newPassword)
      ) {
        
        let data = await User.findOne({
          email: email,
        }).lean();
        if (!data) {
          delete response.data;
          response.message = "worng Email";
          return res.send(response).status(404);
        }
        const match = bcrypt.compareSync(oldPassword, data.password);
        if (!match) {
          delete response.data;
          response.message = "Incorrect Password";
          return res.send(response).status(200);
        }
        if (newPassword.length < 8) {
          delete response.data;
          response.message = "Password must have 8 characters";
          return res.send(response).status(404);
        }
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        const userData = await User.updateOne(
          { email: email },
          {
            $set: { password: hashedPassword },
          }
        );
        delete data.password;
        response.data = data;
        response.status = true;
        response.message = "password change successfuly!...";
        return res.send(response).status(200);
      } else {
        console.log("enter");
        delete response.data;
        response.message = "fill Email & Password";
        return res.send(response).status(400);
      }
    } catch (error) {
      console.log(error);
      delete response.data;
      response.message = "Internal server error";
      return res.status(500).send(response);
    }
  },

  resetPassword: async (req, res) => {
    let response = { data: [], status: false, message: "" };
    try {
      const { email, newPassword } = req.body;
      if (!_.isEmpty(email) && !_.isEmpty(newPassword)) {
        let data = await User.findOne({
          email: email,
        }).lean();
        if (!data) {
          delete response.data;
          response.message = "worng Email";
          return res.send(response).status(404);
        }
        if (newPassword.length < 8) {
          delete response.data;
          response.message = "Password must have 8 characters";
          return res.send(response).status(404);
        }

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        const userData = await User.updateOne(
          { email: email },
          {
            $set: { password: hashedPassword },
          }
        );
        delete data.password;
        response.data = data;
        response.status = true;
        response.message = "password reset successfuly!...";
        return res.send(response).status(200);
      } else {
        delete response.data;
        response.message = "fill Email & Password";
        return res.send(response).status(400);
      }
    } catch (error) {
      console.log(error);
      delete response.data;
      response.message = "Internal server error";
      return res.status(500).send(response);
    }
  },

  verifyOtpByEmail: async (req, res) => {
    let response = { data: [], status: false, message: "" };
    const email = req.body.email;
    const otp = req.body.otp;
    try {
      let userData = await User.findOne({
        email: email,
      }).select("-password");
      if (!userData) {
        delete response.data;
        response.message = "worng Email";
        return res.status(404).send(response);
      }
      const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
      var currTime = moment().format(dateTimeFormat);
      var pastDate = moment(userData.otpTime, dateTimeFormat)
        .add(10, "minutes")
        .format(dateTimeFormat);
      if (currTime <= pastDate) {
        console.log(otp, userData.otp);
        if (otp == userData.otp) {
          // const userVerifyData = await User.updateOne(
          //   { email: email },
          //   {
          //     $set: { otp: null, otpTime: null },
          //   }
          // );
          delete response.data;
          response["message"] = "OTP Verified Successfully...";
          response["status"] = true;
          return res.status(200).send(response);
        } else {
          delete response.data;
          response["message"] = "Wrong OTP.";
          return res.status(401).send(response);
        }
      } else {
        delete response.data;
        response["message"] = "OTP has been expired.";
        return res.status(410).send(response);
      }
    } catch (error) {
      delete response.data;
      response.message = "Internal server error";
      return res.status(500).send(response);
    }
  },

  refreshToken: async (req, res) =>{
    let response = { data: [], status: false, message: "" };
    const token = req.body.token;

    try {
      
      if (!token) {
        delete response.data;
        response.message = 'token missing'
        return res.status(401).send(response);
      }
      
      jwt.verify(token, key, async(err, decoded) => {
        if (err) {
          delete response.data;
          response.message = 'Invalid refresh token'
          return res.status(403).send({ error: 'Invalid refresh token' });
        }
    
        let data = await User.findOne({
          token: token,
        }).select("-password");

        let token_data = {
          email: data.email,
          name: data.name,
        };

        const newAccessToken = jwt.sign(token_data, key, { expiresIn: '24h' });
        await User.updateOne(
          { email: data.email },
          {
            $set: {
              token: newAccessToken
            },
          }
        );
        response.data = newAccessToken
        response.message = "refresh token"
        response.status = true
        res.send(response).status(200);
      });
    } catch (error) {
      console.log(error)
      delete response.data;
      response.message = "Internal server error";
      return res.status(500).send(response);
    }
  },

  socialLogin: async (req, res) =>{
    let response = { data: [], status: false, message: "" };
    const { social_id, name, email } = req.body;
    try {

       // Create token
       const token = jwt.sign({ name, email }, key, { expiresIn: "24h" });
       const token_expire_time = moment().add(1, 'days').format("YYYY-MM-DD LTS");

     // Create new user
     const newUser = {
       name,
       email,
       isEmailVerify: false,
       token : token,
       social_id: social_id
     };
      // Check if user already exists
      const existingUser = await User.findOne({ email, social_id }).select("-password").lean();
      if (existingUser) {
        await User.updateOne(
          { email: email,social_id: social_id },
          {
            $set: {
              token: token
            },
          }
        );
        delete existingUser.token;
        response.status = true;
        response.message = "successfully login";
        response.data = existingUser;
        response.auth = token;
        response.token_expire_time = token_expire_time
        return res.status(200).send(response);
      }

       
      await User.create(newUser);
    
      //Create response
      if (token) {
        delete newUser.token;
        response.status = true;
        response.message = "successfully";
        response.data = newUser;
        response.auth = token;
        response.token_expire_time = token_expire_time
        return res.status(200).send(response);
      }
      delete response.data;
      response.message = "token generate error";
      return res.status(400).send(response);
    } catch (error) {
      console.log(error);
      delete response.data;
      response.message = "Internal server error";
      return res.status(500).send(response);
    }
  }
};
