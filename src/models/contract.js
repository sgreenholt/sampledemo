module.exports = (sequelize, Sequelize) => {
  const Contract = sequelize.define("Contract", {
    terms: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("new", "in_progress", "terminated"),
    },
  });
  Contract.associate = function (models) {
    Contract.belongsTo(models.Profile, { as: "Contractor" });
    Contract.belongsTo(models.Profile, { as: "Client" });
    Contract.hasMany(models.Job);
  };
  return Contract;
};
