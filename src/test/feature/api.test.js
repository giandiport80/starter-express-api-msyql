const request = require('supertest');
const app = require('../../app'); // Import aplikasi

describe('API Endpoints', () => {
  it('api helo test', async () => {
    const response = await request(app).get('/api/hello');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'Hello world',
    });
  });
});
