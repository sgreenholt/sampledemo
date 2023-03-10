const { defaultLimit } = require("../config/blueprints");
module.exports = function (req) {
  if (!req) {
    return {
      limit: defaultLimit,
      offset: 0,
    };
  }

  const reqLimit = req.query.limit || req.params.limit || defaultLimit;
  const reqOffset =
    req.query.offset ||
    req.params.offset ||
    req.query.skip ||
    req.params.skip ||
    0;
  return {
    limit: reqLimit,
    offset: reqOffset,
  };
};
