const Sequelize = require("sequelize");
const parseLimit = require("../utils/parseLimit");
const { codes } = require("../config/errors");

/**
 * /jobs/unpaid Gets all unpaid jobs for a user (***either*** a client or contractor), for ***active contracts only***.
 * @param {*} req
 * @param {*} res
 * @returns {Promise<Jobs[]>} the jobs array that match
 */
exports.getUnpaidJobs = async function (req, res) {
  try {
    const limitAndOffset = parseLimit(req);
    const profileId = req.profile.id;

    // @todo: move to respective service class
    const { Contract, Job } = req.app.get("models");
    const jobs = await Job.findAll({
      ...limitAndOffset,
      include: {
        model: Contract,
        where: Sequelize.and(
          {
            status: "in_progress",
            id: Sequelize.col("job.ContractId"),
          },
          Sequelize.or(
            {
              ContractorId: profileId,
            },
            {
              ClientId: profileId,
            }
          )
        ),
      },
    });

    if (!jobs) {
      return res.status(404).end();
    }

    res.json(jobs);
  } catch (err) {
    console.error(`Error while processing /contracts/${req.url}`, err);
    res.status(500, err.message);
  }
};

/**
 * Pay for a job: a client can only pay if his balance >= the amount to pay.
 * The amount should be moved from the client's balance to the contractor balance.
 * @param {Express.Request} req
 * @param {Profile} req.profile the authenticated profile in the request
 * @param {number} req.params.job_id The id of the job to be paid for
 * @param {number} req.params.amount The amount to be paid
 * @param {Express.Response} res
 * @returns {Promise<void>}
 */
exports.payForJob = async function (req, res) {
  try {
    const profile = req.profile;

    // @todo: move to respective service class
    const { Contract, Job, Profile } = req.app.get("models");
    const { job_id: jobId } = req.params;
    const amount = parseFloat(req.body.amount || 0);

    if (profile.type !== "client") {
      return res.status(403).json({
        success: false,
        code: codes.WRONG_CLIENT,
        message:
          "Only clients are allowed to pay, you must be a client in order to pay",
      });
    }

    if (amount <= 0) {
      return res.status(500).json({
        success: false,
        code: codes.PAYMENT_WRONG_AMOUNT,
        message: "Wrong amount",
      });
    }

    if (profile.balance < amount) {
      return res.status(500).json({
        success: false,
        code: codes.PAYMENT_INSUFFICIENT_AMOUNT,
        message: "Insufficient amount to pay the bill",
      });
    }

    const matchingJob = await Job.findOne({
      where: {
        id: jobId,
      },
      include: {
        model: Contract,
        where: {
          ClientId: profile.id,
        },
      },
    });

    if (!matchingJob) {
      return res.status(404).json({
        success: false,
        code: codes.PAYMENT_JOB_NOT_FOUND,
      });
    }
    // proceed to pay
    const contract = matchingJob.Contract;
    const t = await req.app.get("sequelize").transaction();
    try {
      await Profile.decrement(
        { balance: amount },
        { where: { id: contract.ClientId } },
        { transaction: t }
      );
      await Profile.increment(
        { balance: amount },
        { where: { id: contract.ContractorId } },
        { transaction: t }
      );
      // If the execution reaches this line, no errors were thrown.
      // We commit the transaction.
      await t.commit();
    } catch (error) {
      // If the execution reaches this line, an error was thrown.
      // We rollback the transaction.
      await t.rollback();
      return res.status(500).json({ error, success: false });
    }

    res.json({ success: true, message: "Payment updated" });
  } catch (err) {
    console.error(`Error while processing /contracts/${req.url}`, err);
    res.status(500, err.message);
  }
};
