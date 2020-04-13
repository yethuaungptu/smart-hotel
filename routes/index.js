var express = require("express");
var router = express.Router();
var IOset = require("../IOset");

/* GET home page. */
router.get("/", function (req, res, next) {
  var io = IOset.getIO();
  io.on("connection", (client) => {
    console.log("val");
    client.emit("message", "I receive from you");
    client.on("yethu", (data) => {
      console.log(data);
    });
    client.on("connect", () => {
      console.log("Connected");
    });
    client.on("disconnect", () => {
      console.log("disconnect");
    });
  });
  res.render("index", { title: "Express" });
});

module.exports = router;
