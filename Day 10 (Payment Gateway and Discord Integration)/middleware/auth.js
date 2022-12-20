const jwt = require("jsonwebtoken");
const SECRET = "This is our secret";
const User = require("../models/userModel");
const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        err: "You must be logged in",
      });
    }

    const token = authHeader.split(" ")[1]; // This is the bearer token

    if (!token) {
      return res.status(401).json({
        err: "No token, authorization denied",
      });
    }

    const decoded = jwt.verify(token, SECRET);
    const user = await User.findOne({ where: { id: decoded.user.id } });

    if (!user) {
      return res.status(404).json({ err: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      err: err.message,
    });
  }
};

const isSeller = (req, res, next) => {
  if (req.user.dataValues.isSeller) {
    next();
  } else {
    res.status(401).json({
      err: "You are not a seller",
    });
  }
};

// Added a new middleware to check if the user is a buyer
const isBuyer = (req, res, next) => {
  if (!req.user.dataValues.isSeller) {
    next();
  } else {
    res.status(401).json({
      err: "You are not a buyer",
    });
  }
};

module.exports = { isAuthenticated, isSeller, isBuyer };
