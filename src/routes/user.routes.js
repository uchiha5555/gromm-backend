const express = require("express");

const validators = require("../validators/user-validators");
const userControllers = require("../controllers/user.controller");

const router = express.Router();

// TEST Route
router.get("/", function (req, res) {
  res.send("Hello /api/users routing works 🥂!!");
});

/**
 * @method - POST
 * @param {string} path - /api/users/signup
 * @description - User Signup
 */
router.post("/signup", validators.signupValidator, userControllers.signup);

/**
 * @method - POST
 * @param {string} path - /api/users/login
 * @description - User Login
 */
router.post("/signin", validators.loginValidator, userControllers.login);

module.exports = router;
