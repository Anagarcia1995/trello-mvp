const express = require("express");
const { register, login } = require("../controllers/auth.controller");
const { forgotPassword, resetPassword } = require("../controllers/password.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword)

module.exports = { authRouter: router };
