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

router.get("/home", (req, res) => {
  res.render("home");
});

router.get("/roomlist", (req, res) => {
  res.render("room-list");
});

router.get("/roomdetail", (req, res) => {
  var path = "http://192.168.43.183:3000";
  res.render("room-detail", { path: path });
});

module.exports = router;
