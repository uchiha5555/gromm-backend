const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CustomError = require("../config/errors/CustomError");

const User = require("../models/User");

/*
  1. SIGN UP USER 
*/

module.exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array(), 422, errors.array()[0]?.msg);
    }
    const { firstname, lastname, email, password, username } = req.body;

    /* Custom methods on newUser are defined in User model */
    const newUser = new User({
      firstname,
      lastname,
      email,
      password,
      username,
      avatar: "avatar",
      cover: "cover",
      followers: [],
      following: [],
      bio: "GROMM User",
    });
    await newUser.save(); // Save new User to DB

    const aTkn = await newUser.generateAcessToken(); // Create Access Token

    // Send Response on successful Sign Up
    res.status(201).json({
      success: true,
      user: newUser,
      accessToken: aTkn,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/*
  2. LOGIN USER
*/
module.exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array(), 422, errors.array()[0]?.msg);
    }

    const { email, password } = req.body;

    /* Custom methods on user are defined in User model */
    const user = await User.findOne({ email });
    if (!user) {
      res.json({ success: false, message: 'User not exists' });
      return;
    }
    const passwdMatch = await bcrypt.compare(password, user.password);
    if (!passwdMatch) {
      res.json({ success: false, message: 'Wrong email or password' });
      return;
    }

    const aTkn = await user.generateAcessToken(); // Create Access Token

    // Send Response on successful Login
    res.json({
      success: true,
      user,
      accessToken: aTkn,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
