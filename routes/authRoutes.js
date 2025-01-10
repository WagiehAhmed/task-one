const express = require("express");
const { signupRules, loginRules } = require("../middlewares/validation/user/validationRules");
const { signup, login, logout } = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signupRules, signup);
router.post("/login",loginRules, login);
router.post("/logout", logout);

module.exports = router;
