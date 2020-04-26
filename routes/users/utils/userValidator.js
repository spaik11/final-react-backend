const jwt = require("jsonwebtoken");
const { check } = require("express-validator");
require("dotenv").config();

module.exports = {
  authenticateToken: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(401).json({ error: "ACCESS DENIED" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "ACCESS DENIED" });
      req.user = user;
      next();
    });
  },
  userValidation: [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid-email").isEmail(),
    check(
      "password",
      "Please create password of 6 or more characters"
    ).isLength({
      min: 6,
    }),
  ],
};
