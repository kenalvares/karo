const users = require('./users/users.service.js');
const teams = require('./teams/teams.service.js');
const roles = require('./roles/roles.service.js');
const members = require('./members/members.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(teams);
  app.configure(roles);
  app.configure(members);
};
