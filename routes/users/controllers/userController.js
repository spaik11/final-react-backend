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

  register: (req, res, next) => {
    const { name, email, password, overWatchId } = req.body;
    async.waterfall([
      (callback) => {
        User.findOne({ email }, (err, user) => {
          if (err) return next(err);
          if (user) return res.json({ message: "User already exists" });
        });

        const user = new User();
        user.name = name;
        user.email = email;
        user.password = password;
        user.overWatchId = overWatchId;

        user.save((err) => {
          if (err) return next(err);
        });
        callback(null, user);
      },
      (user, callback) => {
        overwatch.getProfile(
          "pc",
          "us",
          user.overWatchId,
          (
            err,
            {
              username: userName,
              portrait,
              level,
              games: {
                competitive: { won, lost, draw, played },
              },
              competitive: {
                tank: { rank: tRank, rank_img: tRank_img },
                damage: { rank: dRank, rank_img: dRank_img },
                support: { rank: sRank, rank_img: sRank_img },
              },
            }
          ) => {
            if (err) return console.error(err);
            if (!userName) return next();

            User.findOne({ email: user.email }, (err, user) => {
              if (err) return next(err);

              user.OWStats.userName = userName;
              user.OWStats.portrait = portrait;
              user.OWStats.level = level;
              user.OWStats.competitiveGames.won = won;
              user.OWStats.competitiveGames.lost = lost;
              user.OWStats.competitiveGames.draw = draw;
              user.OWStats.competitiveGames.played = played;
              user.OWStats.competitiveStats.tank.rank = tRank;
              user.OWStats.competitiveStats.tank.rank_img = tRank_img;
              user.OWStats.competitiveStats.damage.rank = dRank;
              user.OWStats.competitiveStats.damage.rank_img = dRank_img;
              user.OWStats.competitiveStats.support.rank = sRank;
              user.OWStats.competitiveStats.support.rank_img = sRank_img;

              user.save((err) => {
                if (err) return next(err);
              });
            });
          }
        );
      },
    ]);
    return res.send({ message: "User was successfully created" });
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
