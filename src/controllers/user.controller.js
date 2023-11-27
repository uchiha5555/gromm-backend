const { validationResult } = require("express-validator");

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
    const { firstName, lastName, email, password, userName } = req.body;

    /* Custom methods on newUser are defined in User model */
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      userName,
      userImage: "userImage",
      userCover: "userCover",
      followers: [],
      following: [],
      userBio: "GROMM User",
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
    const user = await User.findByCredentials(email, password); // Identify and retrieve user by credentials
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
