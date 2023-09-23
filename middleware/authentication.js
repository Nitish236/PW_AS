const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors/allErr");

/* ------------------------------------------------------------------ */

//                 Authenticating user

const authenticateUser = async (req, res, next) => {
  // Get Token
  const accessToken = req.cookies.accessToken;

  // If no token found
  if (!accessToken) {
    throw new UnauthenticatedError("No token found, Log In");
  }

  try {
    // Verify the access token
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    // Attach the user
    req.user = {
      userId: payload.id,
      username: payload.username,
      role: payload.role,
    };

    return next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid, Invalid Token");
  }
};

//                 Authorization based on Roles

const authorizePermissions = (roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthenticatedError("Unauthorized to access this route");
    }
    next();
  };
};

// Export Functionality

module.exports = {
  authenticateUser,
  authorizePermissions,
};
