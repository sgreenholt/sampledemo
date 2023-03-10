const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models/index");
const app = express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

const contractsRouter = require("./routes/contracts");
const jobsRouter = require("./routes/jobs");

app.use("/contracts", contractsRouter);
app.use("/jobs", jobsRouter);

module.exports = app;
