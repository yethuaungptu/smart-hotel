var express = require("express");
var router = express.Router();
var IOset = require("../IOset");
var clientList = require("../clientList");
var Room = require("../model/Room");

/* GET home page. */
router.get("/", function (req, res, next) {
  // var io = IOset.getIO();
  // io.on("connection", (client) => {
  //   client.on("connect", (data) => {
  //     console.log("Connected", data);
  //   });
  //   client.on("disconnect", () => {
  //     console.log("disconnect");
  //   });
  // });
  console.log(clientList.getList());
  res.render("index", { title: "Express" });
});

router.get("/home", (req, res) => {
  res.render("home");
});

router.get("/roomlist", (req, res) => {
  var ipList = clientList.getList().map((n) => {
    return n.ip;
  });
  console.log(ipList);
  Room.find({ ip: { $in: ipList } }, (err, rtn) => {
    if (err) throw err;
    console.log(rtn);
    res.render("room-list", { rooms: rtn });
  });
});

router.get("/roomdetail/:no", (req, res) => {
  Room.findOne({ number: req.params.no }, (err, rtn) => {
    if (err) throw err;
    res.render("room-detail", { room: rtn });
  });
});

router.get("/addroom", (req, res) => {
  res.render("room-add");
});

router.post("/addroom", (req, res) => {
  var room = new Room();
  room.number = req.body.rNo;
  room.ip = req.body.ipAddr;
  room.password = req.body.password;

  room.save((err, rtn) => {
    if (err) throw err;
    res.redirect("/roomlist");
  });
});

router.post("/checkroom", (req, res) => {
  Room.findOne(
    { $or: [{ number: req.body.number }, { ip: req.body.ip }] },
    (err, rtn) => {
      if (err) throw err;
      rtn != null ? res.json({ status: true }) : res.json({ status: false });
    }
  );
});

module.exports = router;
