// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get("sequelizeClient");
  const backlogItems = sequelizeClient.define(
    "backlog_items",
    {
      projectid: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        required: false,
        allowNull: true
      },
      priority: {
        type: DataTypes.INTEGER,
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
  backlogItems.associate = function(models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return backlogItems;
};
