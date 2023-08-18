const Admin = require("../../models/Admin");
const mongoose = require("mongoose");

var _ = require("lodash");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const bcrypt = require("bcrypt");
const { sendVerificationEmailResetPwd } = require("../../middleware/email");
const saltRounds = 10;
const key = process.env.JWT_KEY;

module.exports = {
  adminLogin: async (req, res) => {
    let response = { data: [], status: false, message: "" };
    const { email, password } = req.body;
    try {
      if (!_.isEmpty(email) && !_.isEmpty(password)) {
        let data = await Admin.findOne({
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

          let token = jwt.sign({ token_data }, key);
          delete data.password;
          response.data = data;
          response.status = true;
          response.message = "sucessfully login";
          response.auth = token;
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

  adminSignUp: async (req, res) => {
    let response = { data: [], status: false, message: "" };
    const { name, email, mobile, password } = req.body;
    try {

      // Validate Admin input
      if (!name || !email || !password || !mobile) {
        delete response.data;
        response.message = "All fields are required";
        return res.status(400).send(response);
      }

      // Check if Admin already exists
      const existingUser = await Admin.findOne({ email });
      if (existingUser) {
        delete response.data;
        response.message = "Admin already exists";
        return res.status(409).send(response);
      }
      // Hash password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = {
        name,
        email,
        password: hashedPassword,
        mobile
      };
      await Admin.create(newUser);

      // Create token
      const token = jwt.sign({ name, email }, key);

      //Create response
      if (token) {
        delete newUser.password;
        response.status = true;
        response.message = "successfully";
        response.data = newUser;
        response.auth = token;
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
