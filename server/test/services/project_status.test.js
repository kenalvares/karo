const app = require('../../src/app');

describe('\'project_status\' service', () => {
  it('registered the service', () => {
    const service = app.service('project-status');
    expect(service).toBeTruthy();
  });
});
