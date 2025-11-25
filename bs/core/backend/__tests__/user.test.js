const request = require('supertest');
const server = require('../server');
const { sequelize } = require('../connection/sequelize');

// Test data
const testUser = {
	name: 'Test',
	middle_name: 'Middle',
	last_name: 'User',
	user_name: 'testuser',
	email: 'test@example.com',
	password: 'TestPass123!'
};

let createdUserId;
let authToken;

// Setup and teardown
beforeAll(async () => {
	// Wait for database connection
	await sequelize.authenticate();
});

afterAll(async () => {
	// Clean up test data and close connections
	if (createdUserId) {
		// Delete test user if created
		const User = require('../models/core_user');
		await User.destroy({ where: { id: createdUserId }, force: true });
	}
	await sequelize.close();
});

describe('User API Endpoints', () => {
	
	describe('POST /user/register', () => {
		test('should register a new user successfully', async () => {
			const response = await request(server)
				.post('/user/register')
				.send(testUser)
				.expect('Content-Type', /json/)
				.expect(201);

			expect(response.body).toHaveProperty('status', 201);
			expect(response.body).toHaveProperty('message');
			expect(response.body.user).toHaveProperty('id');
			expect(response.body.user.user_name).toBe(testUser.user_name);
			expect(response.body.user.email).toBe(testUser.email);
			expect(response.body.user).not.toHaveProperty('password');

			// Save user ID for cleanup
			createdUserId = response.body.user.id;
		});

		test('should fail with missing required fields', async () => {
			const response = await request(server)
				.post('/user/register')
				.send({
					name: 'Test',
					email: 'test2@example.com'
					// Missing required fields
				})
				.expect('Content-Type', /json/)
				.expect(400);

			expect(response.body).toHaveProperty('status', 400);
		});

		test('should fail when user already exists', async () => {
			const response = await request(server)
				.post('/user/register')
				.send(testUser) // Same user as before
				.expect('Content-Type', /json/)
				.expect(409);

			expect(response.body).toHaveProperty('status', 409);
			expect(response.body.message).toContain('already exists');
		});

		test('should fail with invalid email format', async () => {
			const response = await request(server)
				.post('/user/register')
				.send({
					...testUser,
					user_name: 'anotheruser',
					email: 'invalid-email' // Invalid format
				})
				.expect(400);

			expect(response.body).toHaveProperty('status', 400);
		});
	});

	describe('POST /user/login', () => {
		test('should login with username successfully', async () => {
			const response = await request(server)
				.post('/user/login')
				.send({
					login: testUser.user_name,
					password: testUser.password
				})
				.expect('Content-Type', /json/)
				.expect(200);

			expect(response.body).toHaveProperty('status', 200);
			expect(response.body).toHaveProperty('token');
			expect(response.body.user.user_name).toBe(testUser.user_name);
			expect(response.body.user).not.toHaveProperty('password');

			// Save token for authenticated requests
			authToken = response.body.token;
		});

		test('should login with email successfully', async () => {
			const response = await request(server)
				.post('/user/login')
				.send({
					login: testUser.email,
					password: testUser.password
				})
				.expect('Content-Type', /json/)
				.expect(200);

			expect(response.body).toHaveProperty('status', 200);
			expect(response.body).toHaveProperty('token');
		});

		test('should fail with wrong password', async () => {
			const response = await request(server)
				.post('/user/login')
				.send({
					login: testUser.user_name,
					password: 'WrongPassword123!'
				})
				.expect('Content-Type', /json/)
				.expect(401);

			expect(response.body).toHaveProperty('status', 401);
		});

		test('should fail with non-existent user', async () => {
			const response = await request(server)
				.post('/user/login')
				.send({
					login: 'nonexistentuser',
					password: 'SomePassword123!'
				})
				.expect('Content-Type', /json/)
				.expect(401);

			expect(response.body).toHaveProperty('status', 401);
		});

		test('should fail with missing fields', async () => {
			const response = await request(server)
				.post('/user/login')
				.send({
					login: testUser.user_name
					// Missing password
				})
				.expect('Content-Type', /json/)
				.expect(400);

			expect(response.body).toHaveProperty('status', 400);
		});
	});

	describe('PATCH /user/update/:id', () => {
		test('should update user data successfully', async () => {
			const updateData = {
				name: 'Updated Name',
				email: 'updated@example.com'
			};

			const response = await request(server)
				.patch(`/user/update/${createdUserId}`)
				.send(updateData)
				.expect('Content-Type', /json/)
				.expect(200);

			expect(response.body).toHaveProperty('status', 200);
			expect(response.body.user.name).toBe(updateData.name);
			expect(response.body.user.email).toBe(updateData.email);
			expect(response.body.user).not.toHaveProperty('password');
		});

		test('should fail with invalid user ID', async () => {
			const response = await request(server)
				.patch('/user/update/99999')
				.send({ name: 'Test' })
				.expect('Content-Type', /json/)
				.expect(404);

			expect(response.body).toHaveProperty('status', 404);
		});

		test('should fail with no update data', async () => {
			const response = await request(server)
				.patch(`/user/update/${createdUserId}`)
				.send({})
				.expect('Content-Type', /json/)
				.expect(400);

			expect(response.body).toHaveProperty('status', 400);
		});

		test('should fail when email is already in use', async () => {
			// First create another user
			const anotherUser = {
				name: 'Another',
				last_name: 'User',
				user_name: 'anotheruser',
				email: 'another@example.com',
				password: 'Password123!'
			};

			const createResponse = await request(server)
				.post('/user/register')
				.send(anotherUser);

			const anotherUserId = createResponse.body.user.id;

			// Try to update first user with second user's email
			const response = await request(server)
				.patch(`/user/update/${createdUserId}`)
				.send({ email: anotherUser.email })
				.expect('Content-Type', /json/)
				.expect(409);

			expect(response.body).toHaveProperty('status', 409);

			// Cleanup
			const User = require('../models/core_user');
			await User.destroy({ where: { id: anotherUserId }, force: true });
		});
	});

	describe('PATCH /user/updatePass/:id', () => {
		test('should update password successfully', async () => {
			const response = await request(server)
				.patch(`/user/updatePass/${createdUserId}`)
				.send({
					current_password: testUser.password,
					new_password: 'NewPassword123!'
				})
				.expect('Content-Type', /json/)
				.expect(200);

			expect(response.body).toHaveProperty('status', 200);
			expect(response.body.message).toContain('Password updated successfully');

			// Update test password for future tests
			testUser.password = 'NewPassword123!';
		});

		test('should fail with wrong current password', async () => {
			const response = await request(server)
				.patch(`/user/updatePass/${createdUserId}`)
				.send({
					current_password: 'WrongPassword123!',
					new_password: 'NewPassword456!'
				})
				.expect('Content-Type', /json/)
				.expect(401);

			expect(response.body).toHaveProperty('status', 401);
		});

		test('should fail with missing fields', async () => {
			const response = await request(server)
				.patch(`/user/updatePass/${createdUserId}`)
				.send({
					current_password: testUser.password
					// Missing new_password
				})
				.expect('Content-Type', /json/)
				.expect(400);

			expect(response.body).toHaveProperty('status', 400);
		});
	});

	describe('DELETE /user/delete/:id', () => {
		test('should delete user successfully', async () => {
			const response = await request(server)
				.delete(`/user/delete/${createdUserId}`)
				.expect('Content-Type', /json/)
				.expect(200);

			expect(response.body).toHaveProperty('status', 200);
			expect(response.body.message).toContain('deleted successfully');
		});

		test('should fail with invalid user ID', async () => {
			const response = await request(server)
				.delete('/user/delete/99999')
				.expect('Content-Type', /json/)
				.expect(404);

			expect(response.body).toHaveProperty('status', 404);
		});
	});
});


// Unit tests for individual middlewares
describe('User Middlewares Unit Tests', () => {
	const {
		validateRequiredFields,
		checkUserExists,
		handleSequelizeError
	} = require('../middlewares/mdlw_user');

	describe('validateRequiredFields', () => {
		test('should return true when all fields are present', () => {
			const userData = {
				name: 'Test',
				email: 'test@example.com',
				password: 'pass123'
			};
			const requiredFields = ['name', 'email', 'password'];
			
			const result = validateRequiredFields(userData, requiredFields);
			expect(result).toBe(true);
		});

		test('should return false when a field is missing', () => {
			const userData = {
				name: 'Test',
				email: 'test@example.com'
			};
			const requiredFields = ['name', 'email', 'password'];
			
			const result = validateRequiredFields(userData, requiredFields);
			expect(result).toBe(false);
		});

		test('should return false when a field is empty string', () => {
			const userData = {
				name: 'Test',
				email: '',
				password: 'pass123'
			};
			const requiredFields = ['name', 'email', 'password'];
			
			const result = validateRequiredFields(userData, requiredFields);
			expect(result).toBe(false);
		});

		test('should return false when a field is null', () => {
			const userData = {
				name: 'Test',
				email: null,
				password: 'pass123'
			};
			const requiredFields = ['name', 'email', 'password'];
			
			const result = validateRequiredFields(userData, requiredFields);
			expect(result).toBe(false);
		});
	});

	describe('handleSequelizeError', () => {
		test('should handle SequelizeValidationError', () => {
			const error = {
				name: 'SequelizeValidationError',
				errors: [
					{ message: 'Email must be unique' },
					{ message: 'Password is required' }
				]
			};

			const result = handleSequelizeError(error);
			
			expect(result).toHaveProperty('status', 400);
			expect(result.message).toContain('Email must be unique');
			expect(result.message).toContain('Password is required');
		});

		test('should handle SequelizeUniqueConstraintError', () => {
			const error = {
				name: 'SequelizeUniqueConstraintError',
				message: 'Unique constraint error'
			};

			const result = handleSequelizeError(error);
			
			expect(result).toHaveProperty('status', 400);
			expect(result.message).toBe('Unique constraint error');
		});

		test('should return null for non-Sequelize errors', () => {
			const error = {
				name: 'SomeOtherError',
				message: 'Some other error'
			};

			const result = handleSequelizeError(error);
			
			expect(result).toBeNull();
		});
	});
});

