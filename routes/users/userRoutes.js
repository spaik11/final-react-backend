const express = require("express");
const router = express.Router();
const { authenticateToken, userValidation } = require("./utils/userValidator");

const {
  getAllUsers,
  profile,
  register,
  login,
  logout,
} = require("../users/controllers/userController");

router.get("/getallusers", getAllUsers);
router.get("/profile", authenticateToken, profile);
router.post("/register", userValidation, register);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
