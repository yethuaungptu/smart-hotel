var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MemberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  rfid: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "1", // 1 is active 0 is inactive
  },
  rno: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Members", MemberSchema);
