const express = require("express");
const { register, login } = require("../controllers/auth.controller");
const { forgotPassword, resetPassword } = require("../controllers/password.controller");

const router = express.Router();

// Auth
router.post("/register", register);
router.post("/login", login);

// Password reset 
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = { authRouter: router };
