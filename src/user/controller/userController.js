const User = require("../../models/User");
const mongoose = require("mongoose");
var _ = require("lodash");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const bcrypt = require("bcrypt");
const { sendVerificationEmailResetPwd } = require("../../middleware/email");
const saltRounds = 10;
const key = process.env.JWT_KEY;

module.exports = {
  userLogin: async (req, res) => {
    const { email, password } = req.body;
    console.log("req.body", req.body);
    let response = { data: [], status: false, message: "" };
    if (!_.isEmpty(email) && !_.isEmpty(password)) {
      let data = await User.findOne({
        email: email,
      }).lean();
      if (data == undefined) {
        delete response.data;
        response.message = "worng Email or Password";
        return res.send(response);
      }

      const match = bcrypt.compareSync(password, data.password);
      console.log("match", match);
      if (!match) {
        delete response.data;
        response.message = "worng Email or Password";
        return res.send(response);
      } else {
        let token_data = {
          email: data.email,
          name: data.name,
        };

        let token = jwt.sign({ token_data }, key, { expiresIn: "24h" });
        delete data.password;
        response.data = data;
        response.status = true;
        response.message = "sucessfully login";
        response.auth = token;
        return res.send(response);
      }
    } else {
      delete response.data;
      response.message = "fill Email & Password";
      return res.send(response);
    }
  },

  userSignUp: async (req, res) => {
    console.log("hii");
    let data = { result: [], status: false, message: "Registernation Failed" };
    const { name, email, mobile, password } = req.body;

    try {
      // Validate user input
      if (!name || !email || !password || !mobile) {
        return res.status(400).json({ message: "All fields are required" });
      }
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).send({ message: "User already exists" });
      }
      // Hash password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        mobile,
        isEmailVerify: false,
      });
      await newUser.save();

      // Create token
      const token = jwt.sign({ name, email }, key, { expiresIn: "24h" });

      if (token) {
        //Create response
        delete newUser.password;
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
      res.status(500).json({ message: "Server error" });
    }
  },

  userList: async (req, res) => {
    try {
      let response = { data: [], status: false, message: "" };

      let userData = await User.find().select("-password").lean();
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
      console.log("req", req.body);
      const { email } = req.body;
      let response = { data: [], status: false, message: "" };
      if (!mongoose.Types.ObjectId.isValid(id)) {
        delete response.data;
        response.message = "Wrong user Id .";
        res.send(response);
        return;
      } else {
        console.log("email", email);
        const emailCheck = await User.find({ email: email });
        console.log("emailCheck", emailCheck[0]);
        let emailCheck_id =
          emailCheck && emailCheck[0] != undefined ? emailCheck[0].id : "";
        if (emailCheck_id != id && !_.isEmpty(emailCheck)) {
          response.status = false;
          response.message = "Email Already Exists.";
          return res.send(response);
        } else {
          const userData = await User.updateOne(
            { _id: id },
            {
              $set: req.body,
            }
          );
          response.data = userData;
          if (userData.modifiedCount > 0) {
            response.data = userData;
            response.status = true;
            response.message = "User  Updated.";
            return res.send(response);
          } else {
            response.status = false;
            response.message = "User Already Up to date.";
            return res.send(response);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  getUserInfo: async (req, res) => {
    const id = req.params.id;
    let response = { data: [], status: false, message: "Empty Or Wrong Id" };
    try {
      if (!_.isEmpty(id)) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          delete response.data;
          return res.send(response);
        }
        let userInfo = await User.findOne({ _id: id }).select("-password");
        if (userInfo != undefined) {
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
  },

  forgotPassword: async (req, res) => {
    try {
      let response = { data: [], status: false, message: "" };
      const { email } = req.body;
      if (!_.isEmpty(email)) {
        let data = await User.findOne({
          email: email,
        }).select("-password");
        if (data == undefined) {
          delete response.data;
          response.message = "worng Email";
          return res.send(response);
        }
        var otp = Math.floor(1000 + Math.random() * 9000);
        var currTime = moment().format("YYYY-MM-DD HH:mm:ss");
        console.log("otp", otp);
        if (otp) {
          const userData = await User.updateOne(
            { email: email },
            {
              $set: {
                otp: otp,
                otpTime: currTime,
              },
            }
          );
          if (userData) {
            let sendResult = await sendVerificationEmailResetPwd(email, otp);
            if (sendResult.messageId) {
              return res
                .status(200)
                .json({ message: "Sending otp To your Email" });
            } else {
              return res
                .status(200)
                .json({ message: "Internal Problem in email services" });
            }
          }
        }
      } else {
        delete response.data;
        response.message = "fill Email & Password";
        return res.send(response);
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  resetPassword: async (req, res) => {
    try {
      let response = { data: [], status: false, message: "" };
      const { email, oldPassword, newPassword } = req.body;
      if (
        !_.isEmpty(email) &&
        !_.isEmpty(oldPassword) &&
        !_.isEmpty(newPassword)
      ) {
        let data = await User.findOne({
          email: email,
        }).select("-password");
        if (!data) {
          delete response.data;
          response.message = "worng Email";
          return res.send(response);
        }
        const match = bcrypt.compareSync(oldPassword, data.password);
        if (!match) {
          delete response.data;
          response.message = "Incorrect Password";
          return res.send(response);
        }
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        const userData = await User.updateOne(
          { email: email },
          {
            $set: { password: hashedPassword },
          }
        );
        response.data = data;
        response.status = true;
        response.message = "password change successfuly!...";
        return res.send(response);
      } else {
        delete response.data;
        response.message = "fill Email & Password";
        return res.send(response);
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  verifyOtpByEmail: async (req, res) => {
    let response = { data: [], status: false, message: "" };
    const email = req.decoded.token_data.email;
    const otp = req.params.otp;
    console.log("otp", otp,"email",email);
    try {
      let userData = await User.findOne({
        email: email,
      }).select("-password");
      if (!userData) {
        delete response.data;
        response.message = "worng Email";
        return res.send(response);
      }
      const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
      var currTime = moment().format(dateTimeFormat);
      var pastDate = moment(userData.otpTime, dateTimeFormat)
        .add(10, "minutes")
        .format(dateTimeFormat);
      if (currTime <= pastDate) {
        if (otp == userData.otp) {
          const userVerifyData = await User.updateOne(
            { email: email },
            {
              $set: { isEmailVerify: true },
            }
          );
          response["message"] = "OTP verified successfully.";
          response["status"] = true;
          response["data"] = userVerifyData;
          return res.json(response);
        } else {
            delete response.data;
          response["message"] = "Wrong OTP.";
          return res.json(response);
        }
      } else {
        delete response.data;
        response["message"] = "OTP has been expired.";
        return res.json(response);
      }
    } catch (error) {}
  },
};
