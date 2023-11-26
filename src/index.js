require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { LostErrorHandler } = require("./config/exceptionHandlers/handler.js");

const routes = require("./routes");
const dbConnection = require("./dbConn/mongoose");
const corsOptions = require("./config/cors/cors.js");

/* 
  1. INITIALIZE EXPRESS APPLICATION 🏁
*/
const app = express();
const PORT = process.env.PORT || 8000;

/* 
  2. APPLICATION MIDDLEWARES AND CUSTOMIZATIONS 🪛
*/

// app.use(cors(corsOptions)); // Enable Cross Origin Resource Sharing
// app.options("*", cors(corsOptions));
app.use(cors("*"));
app.use(bodyParser.json());

/* 
  3. APPLICATION ROUTES 🛣️
*/
// Test route

app.get("/", function (req, res) {
  res.send("Hello Welcome to API🙃 !!");
});

// App modular routes
app.use("/api", routes);

/* 
  4. APPLICATION ERROR HANDLING 🚔
*/
// Handle unregistered route for all HTTP Methods
app.all("*", function (req, res, next) {
  // Forward to next closest middleware
  next();
});

app.use(LostErrorHandler); // 404 error handler middleware

/* 
  5. APPLICATION BOOT UP 🖥️
*/

app.on("ready", () => {
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });
});
dbConnection.then(() => {
  console.log("---Database is connected !!---");
  app.emit("ready");
});
