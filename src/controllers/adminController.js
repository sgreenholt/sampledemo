const { codes } = require("../config/errors");

/**
 * ***GET*** `/admin/best-profession?start=<date>&end=<date>`
 * Returns the profession that earned the most money (sum of jobs paid)
 * for any contactor that worked in the query time range.
 *
 * @param {*} req
 * @param {*} res
 * @returns {Promise<Jobs[]>} the jobs array that match
 */
exports.bestProfession = async function (req, res) {
  try {
    const profile = req.profile;
    // @todo: move to respective service class
    const { Contract, Job, Profile } = req.app.get("models");

    const userId = req.params.userId;

    const amount = parseFloat(req.body.amount || 0);

    if (profile.type !== "client") {
      return res.status(403).json({
        success: false,
        code: codes.WRONG_CLIENT,
        message: "Only clients are allowed to deposit",
      });
    }

    if (amount <= 0) {
      return res.status(500).json({
        success: false,
        code: codes.PAYMENT_WRONG_AMOUNT,
        message: "Wrong amount",
      });
    }

    if (!userId) {
      return res.status(500).json({
        success: false,
        code: codes.MISSING_USER_ID,
        message: "Missing userId to deposit money into",
      });
    }

    const totalJobsToPay = await Job.sum("price", {
      include: {
        model: Contract,
        where: {
          ClientId: userId,
        },
      },
    });

    if (totalJobsToPay * 0.25 < amount) {
      return res.status(500).json({
        success: false,
        code: codes.DEPOSIT_TOO_BIG,
        message:
          "Deposit amount can't be more than 25% his total of jobs to pay",
      });
    }

    // proceed to deposit
    await Profile.increment({ balance: amount }, { where: { id: userId } });
    const updatedProfile = await Profile.findOne({ where: { id: userId } });

    res.json({
      success: true,
      message: "Deposit successful",
      user: updatedProfile,
    });
  } catch (err) {
    console.error(`Error while processing /contracts/${req.url}`, err);
    res.status(500, err.message);
  }
};
