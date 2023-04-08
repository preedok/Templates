const express = require("express");
const {
  getAll,
  getDetail,
  update,
  deleted,
  insert,
} = require("../controller/product.controller");
const upload = require("../middleware/multer");
const router = express.Router();

router
  // profile
  .get("/", getAll)
  .get("/:id", getDetail)

  // insert new data
  .post("/product", upload.single("image"), insert)

  // update user data
  .put("/update/:id", upload.single("image"), update)

  // delete user data
  .delete("/:id", deleted);

module.exports = router;
