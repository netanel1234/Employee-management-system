const bcrypt = require("bcrypt");
const _ = require("lodash");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { User, validateUser } = require("../models/user");
const express = require("express");
const router = express.Router();

/**
 * Register a new user -
 * only users that authorized
 * as administrator register.
 */
router.post("/", [auth, admin], async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    username: req.body.username,
    password: req.body.password,
    isAdmin: req.body.isAdmin,
  });

  // Hashing the password and saving the user whit the crypted password.
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  // Generating a jwt and send it to the client
  // in a response header called 'x-auth-token'.
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "username", "isAdmin"]));
});

module.exports = router;
