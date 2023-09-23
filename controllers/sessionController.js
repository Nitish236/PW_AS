const { StatusCodes } = require("http-status-codes");

const bcrypt = require("bcrypt");

// Errors
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors/allErr");

// Model
const User = require("../models/userModel");

/* -------------------------------------------------------------------------- */

//                                  Function for Sign Up

const signUp = async (req, res) => {
  // Retrieve the username and password
  const { username, role, password } = req.body;

  // Check if both the fields are not empty
  if (!username || !password) {
    throw new BadRequestError("Username and password cannot be empty");
  }

  if (!role) {
    throw new BadRequestError("Role cannot be empty");
  }

  // Hash password
  const hashPass = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    username,
    role,
    password: hashPass,
  });

  // Send the user
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, msg: "User created successfully", user });
};

//                                  Function for Log In

const login = async (req, res) => {
  // Retrieve the username and password
  const { username, password } = req.body;

  // Check if both the fields are not empty
  if (!username || !password) {
    throw new BadRequestError("Username and password cannot be empty");
  }

  // Check if such a User exits or not
  const user = await User.findOne({ username });

  if (!user) {
    throw new NotFoundError("No such user exists");
  }

  // Match the password
  const passMatch = await user.comparePassword(user.password, password);

  if (!passMatch) {
    throw new UnauthenticatedError("Username or password is incorrect");
  }

  // Generate the Access Token
  const accessToken = await user.createAccessToken();

  // Set the cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  // Send the response
  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Login Successfull",
    user: {
      name: user.username,
      role: user.role,
    },
    token: accessToken,
  });
};

//                                  Function to Log out the User

const logout = async (req, res) => {
  // Remove the cookie
  res.clearCookie("accessToken");

  res.status(StatusCodes.OK).json({ success: true, msg: "LogOut Successfull" });
};

// Export the functionality

module.exports = {
  login,
  logout,
  signUp,
};
