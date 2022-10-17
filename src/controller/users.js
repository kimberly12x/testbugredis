const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usersModel = require("../models/users");
const responseHelper = require("../helper/responseHelper");
const authHelper = require("../middlewares/JWT");
const createError = require("http-errors");

const client = require('../config/redis')
const crypto = require("crypto");
const sendEmail = require("../middlewares/NodeMailer");

const { authenticateGoogle, uploadToGoogleDrive, deleteFromGoogleDrive } = require("../middlewares/GoogleCloudServices");

const UserController = {
  registerAccount: async (req, res) => {
    try {
      const { email, password, name } = req.body;
      const checkEmail = await usersModel.findEmail(email);

      const role = "user";

      try {
        if (checkEmail.rowCount == 1) throw "Email is already used";
      } catch (error) {
        delete checkEmail.rows[0].password;
        return responseHelper(res, null, 403, error);
      }

      const saltRounds = 10;
      const passwordHash = bcrypt.hashSync(password, saltRounds);
      const id = uuidv4().toLocaleLowerCase();

      const verify = "false";

      const id_users_verification = uuidv4().toLocaleLowerCase();
      const users_id = id;
      const token = crypto.randomBytes(32).toString("hex");

      // localhost
      // const url = `${process.env.BASE_URL}users/verify?id=${users_id}&token=${token}`;

      // deployment
      const url = `${process.env.BASE_URL}id=${users_id}&token=${token}`;

      await sendEmail(email, "Verification Confirmation Email", url);

      await usersModel.create(id, email, passwordHash, name, role, verify);
      await usersModel.createUsersVerification(id_users_verification, users_id, token);

      responseHelper(res, null, 201, "Sign Up Success, Please check your email for verification");
    } catch (error) {
      res.send(createError(400));
    }
  },
  VerifyAccount: async (req, res) => {
    try {
      const queryUsersId = req.query.id;
      const queryToken = req.query.token;

      if (typeof queryUsersId === "string" && typeof queryToken === "string") {
        const checkUsersVerify = await usersModel.findId(queryUsersId);
        delete checkUsersVerify.rows[0].password;
        if (checkUsersVerify.rowCount == 0) {
          return responseHelper(res, null, 403, "Error users has not found");
        }

        if (checkUsersVerify.rows[0].verify != "false") {
          return responseHelper(res, null, 403, "Users has been verified");
        }

        const result = await usersModel.checkUsersVerification(queryUsersId, queryToken);

        if (result.rowCount == 0) {
          return responseHelper(res, null, 403, "Error invalid credential verification");
        } else {
          await usersModel.updateAccountVerification(queryUsersId);
          await usersModel.deleteUsersVerification(queryUsersId, queryToken);
          responseHelper(res, null, 200, "Users verified succesful");
        }
      } else {
        return responseHelper(res, null, 403, "Invalid url verification");
      }
    } catch (error) {
      res.send(createError(404));
    }
  },
  loginAccount: async (req, res) => {
    try {
      const { email, password } = req.body;
      const {
        rows: [user],
      } = await usersModel.findEmail(email);

      if (!user) {
        return responseHelper(res, null, 403, "Email is invalid");
      }
      const isValidPassword = bcrypt.compareSync(password, user.password);
      // console.log(isValidPassword);
      if (!isValidPassword) {
        return responseHelper(res, null, 403, "Password is invalid");
      }

      if (user.verify === "false") {
        return responseHelper(res, null, 403, "Account not verified, Please check your email");
      }

      delete user.password;
      const payload = {
        email: user.email,
        role: user.role,
      };
      user.token = authHelper.generateToken(payload);
      user.refreshToken = authHelper.generateRefreshToken(payload);

      responseHelper(res, user, 201, "Login is Successful");
    } catch (error) {
      res.send(createError(400));
    }
  },
  profileAccount: async (req, res) => {
    try {
      const queryUpdate = req.query.update;
      const queryDelete = req.query.delete;

      const email = req.payload.email;
      const {
        rows: [user],
      } = await usersModel.findEmail(email);
      delete user.password;

      if (typeof queryUpdate === "undefined" && typeof queryDelete === "undefined") {
        
        responseHelper(res, user, 200);
        client.setEx(`users/${email}`, 60 * 60 * 3, JSON.stringify(user))

      } else if (typeof queryUpdate === "string" && typeof queryDelete === "undefined") {
        if (req.file) {
          const auth = authenticateGoogle();

          if (user.picture != null || user.picture != undefined) {
            await deleteFromGoogleDrive(user.picture, auth);
          }

          const response = await uploadToGoogleDrive(req.file, auth);
          const picture = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=s1080`;

          const { username, name, country, city, address, postal_code, phone } = req.body;

          await usersModel.updateAccount(email, username, name, country, city, address, postal_code, phone, picture);

          responseHelper(res, null, 201, "Profile has been updated");
        } else {
          const { username, name, country, city, address, postal_code, phone } = req.body;

          await usersModel.updateNoPict(email, username, name, country, city, address, postal_code, phone);

          responseHelper(res, null, 201, "Profile has been updated");
        }
      } else if (typeof queryUpdate === "undefined" && typeof queryDelete === "string") {
        await usersModel.deleteAccount(email);
        responseHelper(res, null, 200, "Account has been deleted");
      }
    } catch (error) {
      res.send(createError(404));
    }
  },
  changeEmail: async (req, res) => {
    try {
      const email = req.payload.email;
      const emailBody = req.body.email;
      // console.log(email + emailBody);
      // console.log(req.body.email);
      await usersModel.changeEmailAccount(email, emailBody);
      responseHelper(res, null, 201, "Email Account has been update, Please Login again");
    } catch (error) {
      res.send(createError(404));
    }
  },
  changePassword: async (req, res) => {
    try {
      const email = req.payload.email;
      const { password } = req.body;
      const saltRounds = 10;
      const passwordNewHash = bcrypt.hashSync(password, saltRounds);
      // console.log(email + " " + password + "   " + passwordNewHash);
      await usersModel.changePassword(email, passwordNewHash);
      responseHelper(res, null, 200, "Password Account has been update");
    } catch (error) {
      res.send(createError(404));
    }
  },
  refreshToken: async (req, res) => {
    const refreshToken = req.body.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT);
    const payload = {
      email: decoded.email,
      role: decoded.role,
    };
    const result = {
      token: authHelper.generateToken(payload),
      refreshToken: authHelper.generateRefreshToken(payload),
    };
    responseHelper(res, result, 200, "Refresh Token Success");
  },
};

module.exports = UserController;
