// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get("sequelizeClient");
  const projects = sequelizeClient.define(
    "projects",
    {
      teamid: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false
      },
      vision: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false
      },
      background: {
        type: DataTypes.STRING,
        required: false,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        required: false,
        allowNull: true
      },
      finishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        required: false
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
  projects.associate = function(models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return projects;
};
