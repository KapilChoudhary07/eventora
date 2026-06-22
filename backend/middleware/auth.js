// middleware/auth.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // token extract
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // token missing
    if (!token) {
      return res.status(401).json({ msg: "Not authorized, login required" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // user find
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ msg: "User not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

 
//Admin

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ msg: "Admin access only" });
  }
};


module.exports = {protect, admin};
