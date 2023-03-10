module.exports = (sequelize, Sequelize) => {
  const Profile = sequelize.define("Profile", {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    profession: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    balance: {
      type: Sequelize.DECIMAL(12, 2),
    },
    type: {
      type: Sequelize.ENUM("client", "contractor"),
    },
  });
  Profile.associate = function (models) {
    Profile.hasMany(models.Contract, {
      as: "Contractor",
      foreignKey: "ContractorId",
    });
    Profile.hasMany(models.Contract, { as: "Client", foreignKey: "ClientId" });
  };
  return Profile;
};
