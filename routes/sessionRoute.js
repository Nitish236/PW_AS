const router = require("express").Router();

const { authenticateUser } = require("../middleware/authentication");

const { login, logout, signUp } = require("../controllers/sessionController");

/* -------------------------------------------------------------------- */

router.route("/login").post(login); // To log in the user

router.route("/logout").post(authenticateUser, logout); // To Log out the user

router.route("/signup").post(authenticateUser, signUp);

// Export Router

module.exports = router;
