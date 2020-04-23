const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const keys = require("../../../config/keys");

module.exports = {
  getAllUsers: (req, res, next) => {
    User.find({}, (err, users) => {
      if (err) return res.send({ err });
      return res.send({ users });
    }).catch((err) => next(err));
  },

  register: async (req, res, next) => {
    const errors = validationResult(req);
    const { name, email, password, owId } = req.body;

    if (!errors.isEmpty())
      return res.send({ message: "Please check your inputs" });

    let user = await User.findOne({ email });

    try {
      if (user) {
        return res.send({ error: "User already exists", user });
      } else {
        user = await User.create({
          name,
          email,
          password,
          owId,
        });

        user
          .save()
          .then((user) => {
            return res.send({ message: "User was successfully saved", user });
          })
          .catch((err) => next(err));
      }
    } catch (error) {
      return next(error);
    }
  },

  login: (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email }).then((user) => {
      if (!user) {
        return res.send({ emailNotFound: "Email not found" });
      }

      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
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
                user: user.name,
              });
            }
          );
        } else {
          return res.send({ passwordIncorrect: "Password incorrect" });
        }
      });
    });
  },

  logout: (req, res) => {
    req.logout();
    return res.send({ message: "Successfully logged out" });
  },
};
