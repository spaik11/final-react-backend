const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const keys = require("../../../config/keys");

module.exports = {
  getAllUsers: async (req, res, next) => {
    try {
      const response = await User.find({});
      return res.json(response);
    } catch (error) {
      return console.log(error);
    }
  },

  register: async (req, res, next) => {
    const errors = validationResult(req);
    const { name, email, password, owId } = req.body;

    if (!errors.isEmpty())
      return res.json({ message: "Please check your inputs" });

    let user = await User.findOne({ email });

    try {
      if (user) {
        return res.json({ error: "User already exists", user });
      } else {
        user = await User.create({
          name,
          email,
          password,
          owId,
        });

        user.save().then((user) => {
          jwt.sign(
            { user },
            keys.secretOrKey,
            {
              expiresIn: 31556926,
            },
            (err, token) => {
              res.json({ success: true, token: "Bearer " + token, user });
            }
          );
        });
      }
    } catch (error) {
      return console.log(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.json({ emailNotFound: "Email not found" });
      } else {
        const passwordValidation = await bcrypt.compare(
          password,
          user.password
        );
        if (!passwordValidation) {
          return res.json({ passwordIncorrect: "Password incorrect" });
        } else {
          const payload = {
            id: user.id,
            name: user.name,
          };
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926,
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
                user,
              });
            }
          );
        }
      }
    } catch (error) {
      return console.log(error);
    }
  },

  logout: (req, res) => {
    req.logout();
    return res.send({ message: "Successfully logged out" });
  },
};
