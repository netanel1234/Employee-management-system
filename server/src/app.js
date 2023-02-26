const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const login = require("../routes/login");
const register = require("../routes/register");
const shifts = require("../routes/shifts");
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");

const app = express();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1/payplus", { useUnifiedTopology: true })
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.log("Could not connect to mongodb... err=" + err));

app.use(morgan("combined"));
app.use(express.json());
app.use(cors());

app.use("/login", login);
app.use("/register", register);
app.use("/shifts", shifts);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}....`);
});
