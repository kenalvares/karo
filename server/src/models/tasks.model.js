// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get("sequelizeClient");
  const tasks = sequelizeClient.define(
    "tasks",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
      },
      sprintid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true
      },
      done: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        required: true
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: true,
        required: false
      },
      comments: {
        type: DataTypes.JSONB,
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
  tasks.associate = function(models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return tasks;
};
