var express = require("express");
var router = express.Router();
var IOset = require("../IOset");
var clientList = require("../clientList");
var Room = require("../model/Room");
var Member = require("../model/Member");
var bcrypt = require("bcryptjs");

var auth = function (req, res, next) {
  if (req.session.admin) {
    res.locals.admin = req.session.admin;
    next();
  } else {
    res.redirect("/");
  }
};

router.post("/login", function (req, res) {
  var result = bcrypt.compareSync(
    req.body.password,
    "$2a$08$2sfacXXwf.uxDqG0fLuf4.5E8u/y9Y6P52Atc5Xvk/Ci.gc6Pdw8e"
  ); //PTUEC19-20
  req.session.admin = { name: "Admin" };
  res.json({ status: result });
});

router.get("/logout", function (req, res) {
  req.session.destroy(function (err, rtn) {
    if (err) throw err;
    res.redirect("/");
  });
});
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

router.get("/home", auth, (req, res) => {
  res.render("home");
});

router.get("/roomlist", auth, (req, res) => {
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

router.get("/roomdetail/:no", auth, (req, res) => {
  Room.findOne({ number: req.params.no }, (err, rtn) => {
    if (err) throw err;
    Member.find({ rno: req.params.no }, function (err2, rtn2) {
      if (err2) throw err2;
      res.render("room-detail", { room: rtn, members: rtn2 });
    });
  });
});

router.get("/addroom", auth, (req, res) => {
  res.render("room-add");
});

router.post("/addroom", auth, (req, res) => {
  var room = new Room();
  room.number = req.body.rNo;
  room.ip = req.body.ipAddr;
  room.password = req.body.password;

  room.save((err, rtn) => {
    if (err) throw err;
    res.redirect("/roomlist");
  });
});

router.post("/checkroom", auth, (req, res) => {
  Room.findOne(
    { $or: [{ number: req.body.number }, { ip: req.body.ip }] },
    (err, rtn) => {
      if (err) throw err;
      rtn != null ? res.json({ status: true }) : res.json({ status: false });
    }
  );
});

// router.get("/memberadd", (req, res) => {
//   res.render("member/add");
// });

router.post("/checkrfid", auth, (req, res) => {
  Member.findOne(
    { $and: [{ rno: req.body.number }, { rfid: req.body.rfid }] },
    (err, rtn) => {
      if (err) throw err;
      console.log(rtn);
      rtn != null ? res.json({ status: true }) : res.json({ status: false });
    }
  );
});

router.post("/addmember", auth, (req, res) => {
  var member = new Member();
  member.name = req.body.name;
  member.rfid = req.body.rfid;
  member.rno = req.body.rNo;
  member.save(function (err, rtn) {
    if (err) throw err;
    console.log(rtn);
    res.redirect("/roomdetail/" + req.body.rNo);
  });
});

module.exports = router;
