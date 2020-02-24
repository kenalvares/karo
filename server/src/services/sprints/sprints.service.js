// Initializes the `sprints` service on path `/sprints`
const { Sprints } = require('./sprints.class');
const createModel = require('../../models/sprints.model');
const hooks = require('./sprints.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/sprints', new Sprints(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('sprints');

  service.hooks(hooks);
};
