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
    const { name, email, password, admin } = req.body;

    if (!errors.isEmpty())
      return res.render("auth/register", { errors: errors.array() });

    let user = await User.findOne({ email });

    try {
      if (user) {
        return res.render("auth/register");
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
            req.login(user, (err) => {
              if (err) {
                return next(err);
              } else {
                return res.send({
                  message: "User was successfully created",
                  user,
                });
              }
            });
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
