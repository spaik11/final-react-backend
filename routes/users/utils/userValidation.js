const { check } = require("express-validator");

const userValidation = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid-email").isEmail(),
  check("password", "Please create password of 6 or more characters").isLength({
    min: 6,
  }),
];

module.exports = userValidation;
