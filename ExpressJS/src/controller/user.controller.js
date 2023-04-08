const userModel = require("../model/user.model");
const response = require("../helper/response.helper");
const generateToken = require("../helper/auth.helper");
const { v4: uuid } = require("uuid");
const { hash, compare } = require("bcryptjs");
const createError = require("http-errors");
const cloudinary = require("../helper/cloudinary");

const userController = {
  //auth
  register: async (req, res, next) => {
    try {
      const id = uuid();
      const { email, password, full_name } = req.body;
      const { rowCount: check } = await userModel.emailCheck(email);
      if (check) {
        next(new createError(403, "E-mail already in use"));
      }
      const hashedPassword = await hash(password, 10);
      const data = {
        id,
        email,
        full_name,
        password: hashedPassword,
      };
      await userModel.register(data);
      delete data.password;
      response(res, data, 200, "Register success");
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const data = await userModel.emailCheck(email);
      const { rowCount: check } = data;
      console.log(check);
      if (!check) {
        next(new createError(403, "E-mail not registered"));
      }
      const {
        rows: [users],
      } = data;
      const savedPassword = users.password;
      const valid = await compare(password, savedPassword);
      if (!valid) {
        return next(createError(403, "E-mail or password incorrect!"));
      }
      delete users.password;
      const token = generateToken({
        id: users.id,
        full_name: users.full_name,
      });
      response(res, { token, users }, 200, "Login success");
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  //get user
  getUser: async (req, res, next) => {
    try {
      const { rows: users } = await userModel.userAll();
      response(res, users, 200, "Get Buyer success");
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  detailUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        rows: [users],
      } = await userModel.userDetail(id);
      delete users.password;
      response(res, users, 200, "Get Detail success");
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  //update user
  updateAccount: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { email, full_name } = req.body;
      let avatar = null;
      if (req.file) {
        avatar = await cloudinary.uploader.upload(req.file.path);
      }
      const data = {
        id,
        email,
        full_name,
        file: avatar.url,
      };
      await userModel.updateUser(data);
      const {
        rows: [users],
      } = await userModel.userDetail(id);
      delete users.password;
      response(res, users, 200, "Update User success");
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  //delete
  remove: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        rows: [users],
      } = await userModel.userDetail(id);
      delete users.password;
      await userModel.removed(id);
      response(res, users, 200, "Delete user success");
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },
};

module.exports = userController;
