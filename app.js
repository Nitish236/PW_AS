require("express-async-errors");

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectToDatabase = require("./database/connection");

// Importing Routers
const recordRoutes = require("./routes/recordsRoute");
const sessionRoutes = require("./routes/sessionRoute");

// Importing authenticate
const {
  authenticateUser,
  authorizePermissions,
} = require("./middleware/authentication");

// Importing error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// Currently offering to send request from any domain
// Cors
app.use(
  cors({
    credentials: true,
  })
);

// Middleware to parse json, url, and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/api", sessionRoutes);

app.use("/api", authenticateUser, authorizePermissions(["user"]), recordRoutes);

// Middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

function startServer() {
  try {
    connectToDatabase();
    console.log("Connected to Database -- ");

    app.listen(process.env.PORT, () => {
      console.log(`Server listening on port ${process.env.PORT}`);
    });

    return app;
  } catch (error) {
    console.log("Error -- ", error);
  }
}

startServer();

module.exports = app;
