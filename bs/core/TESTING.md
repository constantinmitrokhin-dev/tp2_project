# Testing Guide for User API

## Manual Testing with HTTP Clients

### Prerequisites
1. Make sure your server is running: `npm run dev`
2. Note your base URL (usually `http://localhost:3000` or similar)

---

## User Endpoints Testing

### 1. **Register a New User**
**Endpoint:** `POST /user/register`

**Request Body:**
```json
{
  "name": "John",
  "middle_name": "Michael",
  "last_name": "Doe",
  "user_name": "johndoe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Expected Response (201):**
```json
{
  "status": 201,
  "message": "Account created successfully",
  "user": {
    "id": 1,
    "name": "John",
    "middle_name": "Michael",
    "last_name": "Doe",
    "user_name": "johndoe",
    "email": "john.doe@example.com",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**curl command:**
```bash
curl -X POST http://localhost:3000/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "middle_name": "Michael",
    "last_name": "Doe",
    "user_name": "johndoe",
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

---

### 2. **Login**
**Endpoint:** `POST /user/login`

**Request Body:**
```json
{
  "login": "johndoe",
  "password": "SecurePass123!"
}
```
*Note: `login` can be either username OR email*

**Expected Response (200):**
```json
{
  "status": 200,
  "message": "Welcome back johndoe!",
  "user": {
    "id": 1,
    "name": "John",
    "user_name": "johndoe",
    "email": "john.doe@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**curl command:**
```bash
curl -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "johndoe",
    "password": "SecurePass123!"
  }'
```

---

### 3. **Update User Data**
**Endpoint:** `PATCH /user/update/:id`

**Request Body:**
```json
{
  "name": "Jonathan",
  "email": "jonathan.doe@example.com"
}
```

**Expected Response (200):**
```json
{
  "status": 200,
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "name": "Jonathan",
    "user_name": "johndoe",
    "email": "jonathan.doe@example.com"
  }
}
```

**curl command:**
```bash
curl -X PATCH http://localhost:3000/user/update/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jonathan",
    "email": "jonathan.doe@example.com"
  }'
```

---

### 4. **Update Password**
**Endpoint:** `PATCH /user/updatePass/:id`

**Request Body:**
```json
{
  "current_password": "SecurePass123!",
  "new_password": "NewSecurePass456!"
}
```

**Expected Response (200):**
```json
{
  "status": 200,
  "message": "Password updated successfully for user johndoe"
}
```

**curl command:**
```bash
curl -X PATCH http://localhost:3000/user/updatePass/1 \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "SecurePass123!",
    "new_password": "NewSecurePass456!"
  }'
```

---

### 5. **Delete User (Soft Delete)**
**Endpoint:** `DELETE /user/delete/:id`

**Expected Response (200):**
```json
{
  "status": 200,
  "message": "User johndoe deleted successfully"
}
```

**curl command:**
```bash
curl -X DELETE http://localhost:3000/user/delete/1
```

---

## Testing Error Cases

### Test 1: Missing Required Fields (Registration)
```bash
curl -X POST http://localhost:3000/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com"
  }'
```
**Expected:** 400 Bad Request - Missing required fields

### Test 2: Duplicate User
Register the same user twice
**Expected:** 409 Conflict - User already exists

### Test 3: Invalid Credentials (Login)
```bash
curl -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "johndoe",
    "password": "WrongPassword"
  }'
```
**Expected:** 401 Unauthorized - Invalid credentials

### Test 4: Invalid User ID
```bash
curl -X PATCH http://localhost:3000/user/update/99999 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test"
  }'
```
**Expected:** 404 Not Found - User not found

### Test 5: No Update Data
```bash
curl -X PATCH http://localhost:3000/user/update/1 \
  -H "Content-Type: application/json" \
  -d '{}'
```
**Expected:** 400 Bad Request - No data to update

---

## Using Postman

1. **Create a new Collection** called "User API"
2. **Add requests** for each endpoint above
3. **Use Variables:**
   - Create a variable `baseUrl` = `http://localhost:3000`
   - Create a variable `userId` = `1`
   - Use in requests: `{{baseUrl}}/user/register`

4. **Test Script Example** (in Postman Tests tab):
```javascript
// After login, save the token
pm.test("Login successful", function () {
    pm.response.to.have.status(200);
    const jsonData = pm.response.json();
    pm.environment.set("authToken", jsonData.token);
});
```

---

## PowerShell Commands (Windows)

If using PowerShell, use `Invoke-RestMethod`:

```powershell
# Register User
$body = @{
    name = "John"
    last_name = "Doe"
    user_name = "johndoe"
    email = "john.doe@example.com"
    password = "SecurePass123!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/user/register" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

```powershell
# Login
$loginBody = @{
    login = "johndoe"
    password = "SecurePass123!"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/user/login" `
    -Method Post `
    -Body $loginBody `
    -ContentType "application/json"

# Save token
$token = $response.token
Write-Host "Token: $token"
```

