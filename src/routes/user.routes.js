const express = require("express");

const router = express.Router();

// TEST Route
router.get("/", function (req, res) {
  res.send("Hello /api/users routing works 🥂!!");
});

module.exports = router;
