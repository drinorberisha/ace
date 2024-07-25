// const request = require('supertest');
// const app = require('../index'); // Import your app
// const { connect, closeDatabase, clearDatabase } = require('../config/testDBJest');

// beforeAll(async () => await connect());
// afterEach(async () => await clearDatabase());
// afterAll(async () => await closeDatabase());

// describe('User Controller', () => {
//   it('should register a new user', async () => {
//     const res = await request(app)
//       .post('/api/users/register')
//       .send({
//         username: 'testuser',
//         email: 'testuser@gmail.com',
//         password: 'testpassword'
//       });
//     expect(res.statusCode).toEqual(201);
//     expect(res.body).toHaveProperty('token');
//     expect(res.body).toHaveProperty('user');
//   });

//   it('should login a user', async () => {
//     // First, register a user
//     await request(app)
//       .post('/api/users/register')
//       .send({
//         username: 'testuser',
//         email: 'testuser@gmail.com',
//         password: 'testpassword'
//       });

//     // Now, login the user
//     const res = await request(app)
//       .post('/api/users/login')
//       .send({
//         email: 'testuser@gmail.com',
//         password: 'testpassword'
//       });
//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toHaveProperty('token');
//     expect(res.body).toHaveProperty('user');
//   });
// });
