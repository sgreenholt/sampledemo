const Sequelize = require("sequelize");
const { defaultLimit } = require("../config/blueprints");

/**
 * Exercise 1: it should return the contract only if it belongs to the profile calling.
 * Gets a given contract if found in the matching logged in profile
 * @param {Express.Request} req
 * @param {Profile} req.profile the authenticated profile in the request
 * @param {number} req.params.id The id of the contract to be returned
 * @param {Express.Response} res
 * @returns {Promise<void>}
 */
exports.getProfileContract = async function (req, res) {
  try {
    const profileId = req.profile.id;
    // @todo: move to respective service class
    const { Contract } = req.app.get("models");
    const { id } = req.params;
    const contract = await Contract.findOne({
      where: Sequelize.and(
        { id },
        Sequelize.or(
          {
            ContractorId: profileId,
          },
          {
            ClientId: profileId,
          }
        )
      ),
    });
    if (!contract) {
      return res.status(404).end();
    }

    res.json(contract);
  } catch (err) {
    console.error(`Error while processing ${req.url}`, err);
    res.status(500, err.message);
  }
};

/**
 * Excercise 2: Returns a list of contracts belonging to a user (client or contractor), the list
 * should only contain non terminated contracts
 *
 * Returns a list of contracts
 * @param {Express.Request} req
 * @param {number} req.query.limit defaults to 25 the limit of items to pull
 * @param {number} req.query.skip defaults to 0 the offset to skip while paginating items
 * @param {Express.Response} res
 * @returns {Promise<void>}
 */
exports.getProfileContracts = async function (req, res) {
  try {
    const limit = req.query.limit || defaultLimit;
    const skip = req.query.skip || 0;
    const profileId = req.profile.id;
    // @todo: move to respective service class
    const { Contract } = req.app.get("models");
    const contracts = await Contract.findAll({
      limit,
      offset: skip,
      where: Sequelize.and(
        {
          status: {
            not: "terminated",
          },
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
    });

    if (!contracts) {
      return res.status(404).end();
    }

    res.json(contracts);
  } catch (err) {
    console.error(`Error while processing /contracts/${req.url}`, err);
    res.status(500, err.message);
  }
};
