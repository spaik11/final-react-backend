const User = require("../models/User");
const passport = require("passport");
const overwatch = require("overwatch-api");
const async = require("async");
const { validationResult } = require("express-validator");

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
        return res.send({});
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
            return res.send({ user });
          })
          .catch((err) => next(err));
      }
    } catch (error) {
      return next(error);
    }
  },

  login: passport.authenticate("local-login", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true,
  }),

  logout: (req, res) => {
    req.logout();
    return res.send({ message: "Successfully logged out" });
  },
};
