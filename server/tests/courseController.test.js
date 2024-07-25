const request = require('supertest');
const app = require('../index');  // Your Express app
const { connect, closeDatabase, clearDatabase } = require('../config/testDBJest');

// Initialize database connection before all tests
beforeAll(async () => await connect());

// Clear all test data after every test
afterEach(async () => await clearDatabase());

// Remove and close the database and server after all tests
afterAll(async () => await closeDatabase());

describe('Course Controller', () => {
  it('should create a new course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .send({
        title: "Drinorbaba",
        description: "A comprehensive course on Node.js, covering its fundamentals and advanced topics.",
        price: 99.99,
        createdBy: "60f5a3c2c8d0d40015c2e5e7"
        
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('course');
  });

  it('should get a course by ID', async () => {
    // First, create a course to fetch later
    const newCourse = await request(app)
      .post('/api/courses')
      .send({
        title: "Drinorbaba",
        description: "A comprehensive course on Node.js, covering its fundamentals and advanced topics.",
        price: 99.99,
        createdBy: "60f5a3c2c8d0d40015c2e5e7"
        
      });

    const courseId = newCourse.body.course._id;
    console.log(courseId);

    // Now, fetch the course by ID
    const res = await request(app).get(`/api/courses/${courseId}`);


    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual(courseId);
  });
});
