var express = require("express");
var router = express.Router();
var Room = require("../model/Room");
var Member = require("../model/Member");

var auth = function (req, res, next) {
  if (req.session.user) {
    res.locals.user = req.session.user;
    next();
  } else {
    res.redirect("/users/login");
  }
};

/* GET users listing. */
router.get("/login", function (req, res) {
  res.render("login");
});

router.post("/login", function (req, res) {
  Room.findOne({ number: req.body.rno }, function (err, rtn) {
    if (err) throw err;
    if (rtn != null && Room.compare(req.body.password, rtn.password)) {
      req.session.user = { number: rtn.number };
      res.redirect("/users/roomdetail/" + rtn.number);
    } else {
      res.redirect("/users/login");
    }
  });
});

router.get("/roomdetail/:no", auth, (req, res) => {
  Room.findOne({ number: req.params.no }, (err, rtn) => {
    if (err) throw err;
    Member.find({ rno: req.params.no }, function (err2, rtn2) {
      if (err2) throw err2;
      res.render("roomdetail", { room: rtn, members: rtn2 });
    });
  });
});

router.get("/logout", function (req, res) {
  req.session.destroy(function (err, rtn) {
    if (err) throw err;
    res.redirect("/users/login");
  });
});

module.exports = router;
