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
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
    required: true,
  },
  userCover: {
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
  userBio: {
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
UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await UserModel.findOne({ email });
  if (!user)
    throw new CustomError(
      "Wrong credentials!",
      400,
      "Email or password is wrong!"
    );
  const passwdMatch = await bcrypt.compare(password, user.password);
  if (!passwdMatch)
    throw new CustomError(
      "Wrong credentials!!",
      400,
      "Email or password is wrong!"
    );
  return user;
};

/* 
5. COMPILE MODEL FROM SCHEMA
 */
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
