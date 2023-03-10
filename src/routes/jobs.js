/**
 * Handles all sub-routes of /jobs
 */
const express = require("express");
const router = express.Router();
const { getProfile } = require("../middleware/getProfile");
const { getUnpaidJobs, payForJob } = require("../controllers/jobsController");

router.get("/unpaid", getProfile, getUnpaidJobs);
router.post("/:job_id/pay", getProfile, payForJob);

module.exports = router;
