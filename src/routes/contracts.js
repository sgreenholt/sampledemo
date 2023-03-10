/**
 * Handles all sub-routes of /contacts
 */
const express = require("express");
const router = express.Router();
const { getProfile } = require("../middleware/getProfile");
const {
  getProfileContract,
  getProfileContracts,
} = require("../controllers/contractsController");

router.get("/", getProfile, getProfileContracts);
router.get("/:id", getProfile, getProfileContract);

module.exports = router;
