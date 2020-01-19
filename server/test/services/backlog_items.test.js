const app = require('../../src/app');

describe('\'backlog_items\' service', () => {
  it('registered the service', () => {
    const service = app.service('backlog-items');
    expect(service).toBeTruthy();
  });
});
