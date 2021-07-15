const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
const dotenv = require('dotenv');
dotenv.config();

verifyToken = (req, res, next) => {
  let token = req.headers["access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, process.env.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    req.email = decoded.email;
    next();
  });
};

const authJwt = {
    verifyToken: verifyToken
  };
  module.exports = authJwt;