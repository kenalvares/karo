// Initializes the `backlog_items` service on path `/backlog-items`
const { BacklogItems } = require('./backlog_items.class');
const createModel = require('../../models/backlog_items.model');
const hooks = require('./backlog_items.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/backlog-items', new BacklogItems(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('backlog-items');

  service.hooks(hooks);
};
