// Initializes the `project_status` service on path `/project-status`
const { ProjectStatus } = require('./project_status.class');
const createModel = require('../../models/project_status.model');
const hooks = require('./project_status.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/project-status', new ProjectStatus(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('project-status');

  service.hooks(hooks);
};
