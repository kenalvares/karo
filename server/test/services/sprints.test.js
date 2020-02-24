const app = require('../../src/app');

describe('\'sprints\' service', () => {
  it('registered the service', () => {
    const service = app.service('sprints');
    expect(service).toBeTruthy();
  });
});
