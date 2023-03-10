/**
 * Handles all sub-routes of /jobs
 */
const express = require("express");
const router = express.Router();
const { getProfile } = require("../middleware/getProfile");
const { depositMoney } = require("../controllers/balancesController");

router.post("/deposit/:userId", getProfile, depositMoney);

module.exports = router;
