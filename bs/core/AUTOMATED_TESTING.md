# Automated Testing Setup Guide

## Option 2: Automated Testing with Jest & Supertest

### Step 1: Install Testing Dependencies

Run this command in your `bs/core` directory:

```bash
npm install --save-dev jest supertest @types/jest
```

### Step 2: Update package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon --env-file .env index.js",
    "test": "jest --verbose --coverage",
    "test:watch": "jest --watch",
    "test:user": "jest user.test.js"
  },
  "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": [
      "/node_modules/"
    ],
    "testMatch": [
      "**/__tests__/**/*.test.js"
    ]
  }
}
```

### Step 3: Create Test Environment File

Create `.env.test` in `bs/core/` directory:

```env
# Test Database Configuration
DB_USER=your_test_db_user
DB_PASSWORD=your_test_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tp2_test_db
DB_DIALECT=postgres

# JWT Configuration
JWT_SECRET=test_jwt_secret_key
JWT_EXPIRATION=1h

# Project Settings
PROJECT_NAME=TP2_Test_Project
ALLOWED_DOMAINS=*
ALLOWED_METHODS=GET,POST,PUT,PATCH,DELETE
```

### Step 4: Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run only user tests
npm run test:user

# Run tests with coverage report
npm test -- --coverage
```

---

## Understanding the Test File

The `user.test.js` file includes:

### 1. **Integration Tests** (API Endpoints)
- Tests the entire request/response cycle
- Tests all user endpoints (register, login, update, delete)
- Tests both success and error cases
- Uses real database (test database)

### 2. **Unit Tests** (Individual Functions)
- Tests helper functions in isolation
- Tests `validateRequiredFields`, `handleSequelizeError`, etc.
- Doesn't require database

---

## Test Structure

```javascript
describe('Test Suite Name', () => {
  
  beforeAll(async () => {
    // Runs ONCE before all tests
    // Setup database, connections, etc.
  });

  afterAll(async () => {
    // Runs ONCE after all tests
    // Cleanup, close connections
  });

  beforeEach(async () => {
    // Runs BEFORE EACH test
    // Reset state, clear cache, etc.
  });

  afterEach(async () => {
    // Runs AFTER EACH test
    // Cleanup test data
  });

  test('should do something', async () => {
    // Arrange: Setup test data
    const testData = { name: 'Test' };

    // Act: Execute the function/endpoint
    const response = await request(server)
      .post('/endpoint')
      .send(testData);

    // Assert: Check results
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Test');
  });
});
```

---

## Common Jest Matchers

```javascript
// Equality
expect(value).toBe(expected);           // Strict equality (===)
expect(value).toEqual(expected);        // Deep equality (for objects)

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThan(5);
expect(value).toBeCloseTo(0.3);        // For floating point

// Strings
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Objects
expect(object).toHaveProperty('key');
expect(object).toHaveProperty('key', value);
expect(object).toMatchObject({ key: value });

// Exceptions
expect(() => functionCall()).toThrow();
expect(() => functionCall()).toThrow(Error);
expect(() => functionCall()).toThrow('error message');

// Async
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

---

## Supertest Request Examples

```javascript
// GET request
const response = await request(server)
  .get('/endpoint')
  .expect(200);

// POST with JSON body
const response = await request(server)
  .post('/endpoint')
  .send({ key: 'value' })
  .expect('Content-Type', /json/)
  .expect(201);

// PATCH/PUT
const response = await request(server)
  .patch('/endpoint/123')
  .send({ update: 'data' })
  .expect(200);

// DELETE
const response = await request(server)
  .delete('/endpoint/123')
  .expect(200);

// With authentication
const response = await request(server)
  .get('/protected-endpoint')
  .set('Authorization', `Bearer ${token}`)
  .expect(200);

// With query parameters
const response = await request(server)
  .get('/endpoint')
  .query({ page: 1, limit: 10 })
  .expect(200);

// Access response data
expect(response.status).toBe(200);
expect(response.body).toHaveProperty('data');
expect(response.headers['content-type']).toMatch(/json/);
```

---

## Writing Your Own Tests

### Example: Testing a new middleware

```javascript
// In mdlw_user.js, you have a function:
const checkEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// In user.test.js, add:
describe('checkEmailFormat', () => {
  test('should return true for valid email', () => {
    expect(checkEmailFormat('test@example.com')).toBe(true);
  });

  test('should return false for invalid email', () => {
    expect(checkEmailFormat('invalid-email')).toBe(false);
    expect(checkEmailFormat('test@')).toBe(false);
    expect(checkEmailFormat('@example.com')).toBe(false);
  });
});
```

### Example: Testing a new controller

```javascript
describe('GET /user/:id', () => {
  test('should get user by id successfully', async () => {
    const response = await request(server)
      .get(`/user/${createdUserId}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.user).toHaveProperty('id', createdUserId);
    expect(response.body.user).toHaveProperty('user_name');
    expect(response.body.user).not.toHaveProperty('password');
  });

  test('should return 404 for non-existent user', async () => {
    const response = await request(server)
      .get('/user/99999')
      .expect(404);

    expect(response.body.status).toBe(404);
  });
});
```

---

## Best Practices

1. **Isolate Tests**: Each test should be independent
2. **Use Descriptive Names**: Test names should clearly state what they're testing
3. **Arrange-Act-Assert**: Structure tests clearly
4. **Test Edge Cases**: Not just happy paths
5. **Clean Up**: Always clean up test data
6. **Use Test Database**: Never test on production database
7. **Mock External Services**: Don't call real APIs in tests
8. **Fast Tests**: Keep tests fast (< 1 second each)

---

## Test Coverage

After running `npm test`, you'll see a coverage report:

```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------------|---------|----------|---------|---------|-------------------
All files           |   85.23 |    78.45 |   90.12 |   85.67 |                   
 controllers        |   92.30 |    87.50 |   95.00 |   92.30 |                   
  ctrl_user.js      |   92.30 |    87.50 |   95.00 |   92.30 | 45-47            
 middlewares        |   82.15 |    75.30 |   88.20 |   82.15 |                   
  mdlw_user.js      |   82.15 |    75.30 |   88.20 |   82.15 | 67-69,145        
--------------------|---------|----------|---------|---------|-------------------
```

**Goal**: Aim for 80%+ coverage on critical code

---

## Debugging Tests

```bash
# Run a single test file
npm test user.test.js

# Run tests matching a pattern
npm test -- -t "should register"

# Run in debug mode (with Node debugger)
node --inspect-brk node_modules/.bin/jest --runInBand

# Show console.log output
npm test -- --verbose

# No coverage (faster)
npm test -- --coverage=false
```

---

## CI/CD Integration

Add to your CI/CD pipeline (e.g., GitHub Actions):

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

---

## Quick Reference Commands

```bash
# Install dependencies
npm install --save-dev jest supertest

# Run all tests
npm test

# Watch mode (re-run on changes)
npm run test:watch

# Run specific test file
npm test user.test.js

# Run tests matching pattern
npm test -- -t "register"

# Coverage report
npm test -- --coverage

# Update snapshots
npm test -- -u
```

