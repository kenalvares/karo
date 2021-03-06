// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get("sequelizeClient");
  const users = sequelizeClient.define(
    "users",
    {
      firstname: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false
      },
      lastname: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false
      },
      tagline: {
        type: DataTypes.STRING,
        allowNull: true
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bio: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
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
  users.associate = function(models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return users;
};
