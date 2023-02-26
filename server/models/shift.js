const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullDate: {
    type: String,
    default: "---",
  },
  startShift: Date,
  endShift: Date,
  startPause: Date,
  endPause: Date,
  entranceTime: {
    type: String,
    default: "---",
  },
  leavingTime: {
    type: String,
    default: "---",
  },
  totalPause: {
    type: Number,
    default: 0,
  },
  totalHoursShift: {
    type: Number,
    default: 0,
  },
  totalRegularHoursShift: {
    type: Number,
    default: 0,
  },
  totalOvertime1: {
    type: Number,
    default: 0,
  },
  totalOvertime2: {
    type: Number,
    default: 0,
  },
});

const Shift = mongoose.model("Shift", shiftSchema);

function parseDateToHoursAndMinutes(date) {
  return (
    ("0" + date.getHours()).slice(-2) +
    ":" +
    ("0" + date.getMinutes()).slice(-2)
  );
}

exports.Shift = Shift;
exports.parseDateToHoursAndMinutes = parseDateToHoursAndMinutes;
