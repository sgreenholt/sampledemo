const Sequelize = require("sequelize");
const parseLimit = require("../utils/parseLimit");

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
