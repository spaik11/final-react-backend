const express = require("express");
const router = express.Router();
const passport = require("passport");
const userValidation = require("../users/utils/userValidation");

require("../../lib/passport");

const {
  getAllUsers,
  register,
  login,
  logout,
} = require("../users/controllers/userController");

router.get("/getallusers", getAllUsers);
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ msg: "Success" });
  }
);
router.post("/register", userValidation, register);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
