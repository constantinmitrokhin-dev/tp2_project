# Quick Start: Testing Your User API

## 🚀 Fastest Way to Start Testing (5 minutes)

### Step 1: Start Your Server
```bash
cd bs/core
npm run dev
```

Server should be running at `http://localhost:3000` (or your configured port)

---

## Option A: Manual Testing with Postman (Recommended for Beginners)

### 1. Import the Postman Collection
1. Open Postman
2. Click **Import** button
3. Select the file: `bs/core/User_API.postman_collection.json`
4. Collection "User API Tests" will appear in your sidebar

### 2. Update the Base URL (if needed)
1. Click on the collection name
2. Go to **Variables** tab
3. Update `baseUrl` if your server runs on a different port

### 3. Run Tests in Order
Execute the requests in this order:
1. ✅ **Register User** - Creates a new user (saves user ID automatically)
2. ✅ **Login User** - Logs in and saves auth token
3. ✅ **Update User Data** - Updates user information
4. ✅ **Update Password** - Changes password
5. ✅ **Delete User** - Soft deletes the user

### 4. Test Error Cases
Try the error test requests to see how the API handles invalid inputs:
- Missing Fields
- Invalid Credentials
- User Not Found

**Each request has built-in tests that automatically verify the response!**

---

## Option B: Manual Testing with curl (For Terminal Lovers)

### Quick Test Commands

**1. Register a user:**
```bash
curl -X POST http://localhost:3000/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","last_name":"Doe","user_name":"johndoe","email":"john@example.com","password":"Pass123!"}'
```

**2. Login:**
```bash
curl -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{"login":"johndoe","password":"Pass123!"}'
```

**3. Update user (replace `1` with actual user ID):**
```bash
curl -X PATCH http://localhost:3000/user/update/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Jonathan"}'
```

**4. Delete user:**
```bash
curl -X DELETE http://localhost:3000/user/delete/1
```

📖 **More examples:** See `TESTING.md` for complete curl examples

---

## Option C: Automated Testing with Jest (For Comprehensive Testing)

### One-Time Setup (5 minutes)
```bash
cd bs/core

# 1. Install testing dependencies
npm install --save-dev jest supertest

# 2. Add to package.json scripts:
# "test": "jest --verbose --coverage"
# (Or manually copy from AUTOMATED_TESTING.md)

# 3. Configure test database in .env.test
# (Copy .env and change DB_NAME to tp2_test_db)
```

### Run Tests
```bash
# Run all tests
npm test

# Run only user tests
npm test user.test.js

# Watch mode (auto-rerun on changes)
npm test -- --watch
```

📖 **Complete setup:** See `AUTOMATED_TESTING.md`

---

## Which Option Should I Choose?

### 🟢 Start with **Postman** if you:
- Are new to API testing
- Want visual interface
- Need to test manually during development
- Want to share tests with non-technical team members

### 🔵 Use **curl** if you:
- Prefer command line
- Need to script tests
- Want quick one-off tests
- Are comfortable with terminal

### 🟣 Use **Jest** if you:
- Want automated testing
- Need CI/CD integration
- Want test coverage reports
- Are building production application
- Need regression testing

**💡 Pro Tip:** Use **Postman for development** + **Jest for CI/CD**

---

## Verify Everything Works

### Test Sequence (2 minutes)

1. **Start your server:**
```bash
npm run dev
```

2. **Register a user:**
```bash
curl -X POST http://localhost:3000/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","last_name":"User","user_name":"testuser","email":"test@test.com","password":"Test123!"}'
```

Expected: Status 201, returns user object

3. **Login:**
```bash
curl -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{"login":"testuser","password":"Test123!"}'
```

Expected: Status 200, returns user and token

✅ **If both work, your API is ready!**

---

## Common Issues & Solutions

### ❌ "Cannot connect to server"
- Check if server is running (`npm run dev`)
- Verify port number in URL
- Check firewall settings

### ❌ "Database connection error"
- Verify database is running
- Check `.env` file configuration
- Ensure database exists

### ❌ "User already exists" (409)
- Normal! User is already registered
- Use different email/username
- Or delete user first

### ❌ "Invalid ID format"
- Use numeric ID (e.g., `1`, not `abc`)
- Check the ID exists in database

### ❌ "CORS error" (in browser)
- Normal for browser requests
- Use Postman/curl instead
- Or configure CORS in server

---

## Next Steps

1. ✅ Test all happy path scenarios
2. ✅ Test all error scenarios
3. ✅ Set up automated tests with Jest
4. ✅ Add tests to CI/CD pipeline
5. ✅ Document any API changes

---

## Quick Reference

| Task | Tool | Command |
|------|------|---------|
| Start server | Terminal | `npm run dev` |
| Test with GUI | Postman | Import `User_API.postman_collection.json` |
| Quick test | curl | See examples above |
| Run all tests | Jest | `npm test` |
| Check coverage | Jest | `npm test -- --coverage` |

---

## Documentation Files

- 📄 **TESTING.md** - Complete manual testing guide with all curl examples
- 📄 **AUTOMATED_TESTING.md** - Full Jest setup and testing guide
- 📄 **User_API.postman_collection.json** - Ready-to-use Postman collection
- 📄 **backend/__tests__/user.test.js** - Automated test suite

---

## Need Help?

- Check the detailed guides: `TESTING.md` and `AUTOMATED_TESTING.md`
- Review the test file: `backend/__tests__/user.test.js`
- Check server logs for error details
- Verify database state using database client

**Happy Testing! 🎉**

