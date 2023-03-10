module.exports = (sequelize, Sequelize) => {
  const Job = sequelize.define("Job", {
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    price: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    },
    paid: {
      type: Sequelize.BOOLEAN,
      default: false,
    },
    paymentDate: {
      type: Sequelize.DATE,
    },
  });
  Job.associate = function (models) {
    Job.belongsTo(models.Contract);
  };
  return Job;
};