// routes/authRoutes.js
const express = require("express");
const {
  register,
  login,
  validate2FA,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/2fa-validate", validate2FA);

module.exports = router;
