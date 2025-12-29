const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // 🔥 VERY IMPORTANT: allow preflight requests
    if (req.method === "OPTIONS") {
      return next();
    }

    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).send("Please Login!!!");
    }

    const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) {
      return res.status(401).send("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};
