const productModel = require("../model/product.model");
const { v4: uuid } = require("uuid");
const createError = require("http-errors");
const response = require("../helper/response.helper");
const cloudinary = require("../helper/cloudinary");

const productController = {
  getAll: async (req, res, next) => {
    // const sort = req.query.sort;
    // const asc = req.query.asc;
    // const limit = parseInt(req.query.limit) || 3;
    // const page = parseInt(req.query.page) || 1;
    // const offset = (page - 1) * limit;
    try {
      const { rows: product } = await productModel
        .getAll
        // sort,
        // asc,
        // limit,
        // offset
        ();
      response(res, product, 200, "Get data success");
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  // product detail
  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        rows: [product],
      } = await productModel.getDetail(id);
      response(res, product, 200, "Get Data Detail success");
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  // insert
  insert: async (req, res, next) => {
    try {
      const id = uuid();
      const { nama_product, harga_beli, harga_jual, stok } = req.body;
      let image;
      if (req.file) {
        image = await cloudinary.uploader.upload(req.file.path);
      }
      const data = {
        id,
        nama_product,
        harga_beli,
        harga_jual,
        stok,
        image: image.url,
      };
      console.log(data);
      await productModel.create(data);
      response(res, data, 200, "create product success");
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  // update
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nama_product, harga_beli, harga_jual, stok } = req.body;
      let image = null;
      if (req.file) {
        image = await cloudinary.uploader.upload(req.file.path);
      }
      const data = {
        id,
        nama_product,
        harga_beli,
        harga_jual,
        stok,
        image: image.url,
      };
      await productModel.edit(data);
      const {
        rows: [product],
      } = await productModel.getDetail(id);
      response(res, product, 200, "Update record success");
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  // delete
  deleted: async (req, res, next) => {
    try {
      const { id } = req.params;
      await productModel.delete(id);
      res.json({
        msg: "delete product berhasil",
      });
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },
};

module.exports = productController;
