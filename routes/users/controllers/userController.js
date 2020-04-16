const User = require('../models/User');
const passport = require('passport');
const { validationResult } = require('express-validator');

module.exports = {
    getAllUsers: (req, res, next) => {
        User.find({}, (err, users) => {
            if (err) return res.send({ err });
            return res.send({ users });
        })
        .catch((err) => next(err));
    },

    register: async (req, res, next) => {
        const errors = validationResult(req);
        const { name, email, password, overWatchId } = req.body;

        if (!errors.isEmpty()) return res.send({ errors: errors.array() });

        let user = await User.findOne({ email });

        try {
            if (user) {
                return res.send({ message: 'User already exists' });
            } else {
                user = await User.create({
                    name,
                    overWatchId,
                    email,
                    password
                });
    
                user.save()
                    .then((user) => {
                        req.login(user, (err) => {
                            if (err) {
                                return res.send({ err });
                            } else {
                                return res.send({ user });
                            }
                        })
                    })
                    .catch((err) => next(err));
            };
        } catch (error) {
            return next(error);
        };
    },

    login: passport.authenticate('local-login', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    }),

    logout: (req, res) => {
        req.logout();
        return res.send({ message: 'Successfully logged out'});
    }
}