const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Pull in Environment variables
const ACCESS_TOKEN = {
  secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
  expiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY,
};

/* 
1. CREATE USER SCHEMA
 */

const User = mongoose.Schema;

const UserSchema = new User({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  followers: [
    {
      type: String,
      required: true,
    },
  ],
  following: [
    {
      type: String,
      required: true,
    },
  ],
  bio: {
    type: String,
    required: true,
  },
});

/* 
2. ATTACH MIDDLEWARE
 */
UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

/* 
3. ATTACH CUSTOM INSTANCE METHODS
 */
UserSchema.methods.generateAcessToken = function () {
  const user = this;

  // Create signed access token
  const accessToken = jwt.sign(
    {
      _id: user._id.toString(),
      fullName: `${user.firstName} ${user.lastName}`,
      username: `${user.username}`,
      email: user.email,
    },
    ACCESS_TOKEN.secret,
    {
      expiresIn: ACCESS_TOKEN.expiry,
    }
  );

  return accessToken;
};

/* 
4. ATTACH CUSTOM STATIC METHODS
 */

/* 
5. COMPILE MODEL FROM SCHEMA
 */
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
