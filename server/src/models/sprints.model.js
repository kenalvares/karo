// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get("sequelizeClient");
  const sprints = sequelizeClient.define(
    "sprints",
    {
      number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true
      },
      backlog: {
        type: DataTypes.JSON,
        allowNull: true,
        required: false
      },
      projectid: {
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
  sprints.associate = function(models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return sprints;
};
