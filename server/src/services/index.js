const users = require("./users/users.service.js");
const teams = require("./teams/teams.service.js");
const roles = require("./roles/roles.service.js");
const members = require("./members/members.service.js");
const friends = require("./friends/friends.service.js");
const notification = require("./notification/notification.service.js");
const projects = require('./projects/projects.service.js');
const projectStatus = require('./project_status/project_status.service.js');
const backlogItems = require('./backlog_items/backlog_items.service.js');
const sprints = require('./sprints/sprints.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
  app.configure(users);
  app.configure(teams);
  app.configure(roles);
  app.configure(members);
  app.configure(friends);
  app.configure(notification);
  app.configure(projects);
  app.configure(projectStatus);
  app.configure(backlogItems);
  app.configure(sprints);
};
