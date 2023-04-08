const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const jwtAuth = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
      req.decoded = decoded;
      next();
    } else {
      res.json({
        message: "token not found",
      });
    }
  } catch (error) {
    console.log(error);
    if (error.name === "JsonWebTokenError") {
      next(new createError(400, "token is invalid"));
    } else if (error.name === "TokenExpiredError") {
      next(new createError(400, "token is expired"));
    } else {
      next(new createError(400, "error occured"));
    }
  }
};

module.exports = {
  jwtAuth,
};
