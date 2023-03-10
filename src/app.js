const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models/index");
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.set("sequelize", sequelize);
app.set("models", sequelize.models);

const contractsRouter = require("./routes/contracts");
const jobsRouter = require("./routes/jobs");
const balancesRouter = require("./routes/balances");

app.use("/contracts", contractsRouter);
app.use("/jobs", jobsRouter);
app.use("/balances", balancesRouter);

module.exports = app;
