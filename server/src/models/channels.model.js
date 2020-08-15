// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get("sequelizeClient");
  const channels = sequelizeClient.define(
    "channels",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
      },
      messages: {
        type: DataTypes.JSONB,
        allowNull: true,
        required: false
      },
      friendid: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
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
  channels.associate = function(models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return channels;
};
