const express = require("express");
const {
  register,
  login,
  getUser,
  detailUser,
  updateAccount,
  remove,
} = require("../controller/user.controller");
const upload = require("../middleware/multer");
const router = express.Router();

router
  .post("/register", register)
  .post("/login", login)
  .get("/list", getUser)
  .get("/detail/:id", detailUser)
  .put("/update/:id", upload.single("avatar"), updateAccount)
  .delete("/delete/:id", remove);

module.exports = router;
