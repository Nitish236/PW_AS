require("dotenv").config;

const { Schema, model } = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Schema

const userSchema = Schema({
  username: {
    type: String,
    reuired: [true, "Username is required"],
  },
  role: {
    type: String,
    enum: ["user", "other"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

//                            Function to create Access Token

userSchema.methods.createAccessToken = async function () {
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

//                            Function to compare Password during Login

userSchema.methods.comparePassword = async function (password, formPassword) {
  const passMatch = await bcrypt.compare(formPassword, password);

  return passMatch;
};

// Model

module.exports = model("User", userSchema);
