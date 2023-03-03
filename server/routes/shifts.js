const { Shift, parseDateToHoursAndMinutes } = require("../models/shift");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const REGULAR_HOURS = 8.6;
const OVERTIME_125 = 10.6;

router.get("/", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).send("No authorization header provided.");

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer")
    return res.status(401).send("Invalid authorization header format.");

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
  } catch (ex) {
    return res.status(401).send("Invalid or expired token.");
  }

  const shifts = await Shift.find({ userId: req.user._id });
  if (!shifts) return res.status(404).send("No shifts found for this user.");

  res.send({ shifts: shifts });
});

router.post("/startShift/", auth, async (req, res) => {
  const now = new Date();
  const shift = new Shift({
    userId: req.user._id,
    fullDate:
      now.getDate().toString().padStart(2, "0") +
      "/" +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      now.getFullYear().toString(),
    startShift: now,
    entranceTime: parseDateToHoursAndMinutes(now),
  });

  await shift.save();
  res.send({ shift });
});

router.post("/startPause/", auth, async (req, res) => {
  const { error } = validateShiftId(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let shift = await Shift.findById(req.body.shiftId);
  if (!shift)
    return res.status(400).send("The shift with the given id was not found.");

  shift.startPause = Date.now();

  shift = await shift.save();

  res.send({ shift: shift });
});

router.post("/endPause/", auth, async (req, res) => {
  const { error } = validateShiftId(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let shift = await Shift.findById(req.body.shiftId);
  if (!shift) return res.status(400).send("Invalid shift id.");

  shift.endPause = Date.now();
  shift.totalPause =
    shift.totalPause +
    (Math.abs(shift.endPause - shift.startPause) / 36e5).toFixed(2);

  shift.save();

  res.send({ shift: shift });
});

router.post("/endShift/", auth, async (req, res) => {
  const { error } = validateShiftId(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let shift = await Shift.findById(req.body.shiftId);
  if (!shift)
    return res.status(400).send("The shift with the given id was not found.");

  shift.endShift = new Date();
  shift.leavingTime = parseDateToHoursAndMinutes(shift.endShift);

  shift.totalHoursShift = (
    Math.abs(shift.endShift - shift.startShift) / 36e5
  ).toFixed(2);

  shift.totalHoursShiftExcludingPauses =
    shift.totalHoursShift - shift.totalPause;

  if (shift.totalHoursShiftExcludingPauses < REGULAR_HOURS) {
    shift.totalRegularHoursShift = shift.totalHoursShiftExcludingPauses;
  } else if (shift.totalHoursShiftExcludingPauses < OVERTIME_125) {
    shift.totalRegularHoursShift = REGULAR_HOURS;
    shift.totalOvertime1 = shift.totalHoursShiftExcludingPauses - REGULAR_HOURS;
  } else {
    shift.totalRegularHoursShift = REGULAR_HOURS;
    shift.totalOvertime1 = 2;
    shift.totalOvertime2 = shift.totalHoursShiftExcludingPauses - OVERTIME_125;
  }

  shift = await shift.save();

  const shifts = await Shift.find({ userId: req.user._id });

  res.send({ shifts: shifts });
});

function validateShiftId(shiftId) {
  const schema = Joi.object({
    shiftId: Joi.objectId().required(),
    token: Joi.required(),
  });

  return schema.validate(shiftId);
}

module.exports = router;
