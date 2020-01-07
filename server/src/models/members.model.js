// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get("sequelizeClient");
  const members = sequelizeClient.define(
    "members",
    {
      teamid: {
        type: DataTypes.STRING,
        reuired: true,
        allowNull: false
      },
      userid: {
        type: DataTypes.STRING,
        reuired: true,
        allowNull: false
      },
      roleid: {
        type: DataTypes.STRING,
        reuired: true,
        allowNull: false
      },
      fav: {
        type: DataTypes.BOOLEAN,
        reuired: true,
        allowNull: false
      }
    },
    {
      hooks: {
        beforeCount(options) {
          options.raw = true;
        }
      }
    }
  );

  // eslint-disable-next-line no-unused-vars
  members.associate = function(models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return members;
};
