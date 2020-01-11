// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get("sequelizeClient");
  const friends = sequelizeClient.define(
    "friends",
    {
      userid_1: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false
      },
      userid_2: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        required: true,
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
  friends.associate = function(models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return friends;
};
