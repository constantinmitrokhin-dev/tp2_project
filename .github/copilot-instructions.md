# AI Agent Instructions for tp2_project

## Project Overview
This is a modular e-commerce system built with Node.js, Express, and PostgreSQL. The project follows a microservices-like architecture with two main components:

- `bs/core/` - Core system functionality (auth, base services)
- `loader/` - Data processing and initial database seeding

## Key Architectural Patterns

### Module Structure
Each module (like `core`, `inventory`) follows this structure:
```
module/
├── backend/        # Server-side code
│   ├── connection/   # Database connections
│   ├── controllers/  # Request handlers
│   ├── middlewares/  # Express middlewares
│   ├── models/       # Sequelize models
│   ├── routes/       # Express routes
│   ├── services/     # Business logic
│   └── server.js     # Module entry point
├── frontend/       # UI components
└── config.json    # Module configuration
```

### Database Patterns
- Uses Sequelize ORM with PostgreSQL
- Models defined in `models/` directories
- Core tables prefixed with `CORE_` (e.g., `CORE_PRODUCT_TYPE`)
- Foreign key relationships enforced at DB level

### Authentication Flow
- JWT-based authentication
- Token required in protected endpoints via header: `token`
- Additional headers used: `id`, `storename`, `user_email`

### API Conventions
- RESTful endpoints under module namespaces
- Standard response format:
  - Success: `{status: 200, data: {...}}`
  - Error: `{status: error.status, message: error.message}`

## Development Workflows

### Environment Setup
1. Create `.env` file with required variables:
   ```
   PROJECT_NAME=tp2_project
   ALLOWED_DOMAINS=*
   ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
   ```

### Database Management
- Sequelize models in `backend/models/`
- Initial data loaded via `loader/` module
- Use `pg-hstore` for complex object serialization

### Testing
Focus on integration tests for API endpoints verifying:
- Authentication flows (US 1.1-1.4)
- Product management operations (US 2.1-2.6)
- Data validation rules

## Common Tasks

### Adding New Endpoints
1. Create route in module's `routes/routes.js`
2. Implement controller in `controllers/`
3. Add business logic in `services/`
4. Update models if needed

### Error Handling
- Use HTTP status codes appropriately
- Wrap async routes in try-catch blocks
- Return standardized error responses

## Key Files to Review
- `bs/core/backend/server.js` - Main server setup and middleware config
- `bs/core/backend/routes/routes.js` - API routing structure
- `UserStories.md` - Detailed feature requirements and acceptance criteria