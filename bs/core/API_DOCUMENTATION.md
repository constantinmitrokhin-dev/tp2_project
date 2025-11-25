# Documentación API Core

## Qué hace esta API

Esta API gestiona el núcleo de un sistema de negocios. Permite administrar:
- Usuarios (registro, login, actualización)
- Negocios y sus ubicaciones
- Productos y tipos de productos
- Países y estados
- Relaciones entre usuarios y negocios

## Arquitectura

La API sigue una arquitectura en capas:

```
Routes (rutas)
    |
Middlewares (validaciones)
    |
Controllers (lógica de control)
    |
Services (lógica de negocio)
    |
Models (acceso a datos)
    |
Database (PostgreSQL)
```

### Componentes:

- **Routes**: Define los endpoints y métodos HTTP
- **Middlewares**: Valida datos antes de procesarlos
- **Controllers**: Coordina el flujo de datos
- **Services**: Ejecuta la lógica de negocio
- **Models**: Define las tablas y sus relaciones (Sequelize ORM)

### Tecnologías:

- Express (servidor web)
- Sequelize (ORM para PostgreSQL)
- bcrypt (encriptación de contraseñas)
- JWT (autenticación con tokens)
- Morgan (logs de peticiones)

## Tablas principales

### core_object
Tabla base de herencia. Contiene:
- `id`: Identificador único
- `ht_data`: Datos históricos automáticos

### core_user
Almacena usuarios. Campos:
- `id`, `ht_data` (heredados de core_object)
- `name`: Nombre
- `middle_name`: Segundo nombre (opcional)
- `last_name`: Apellido
- `user_name`: Nombre de usuario (único)
- `email`: Correo electrónico (único)
- `password`: Contraseña encriptada
- `jwt`: Token de sesión
- `status`: Estado del usuario (active, inactive, etc)

### core_country
Países del sistema:
- `id`, `ht_data`
- `name`: Nombre del país
- `code`: Código del país

### core_state
Estados o provincias:
- `id`, `ht_data`
- `name`: Nombre del estado
- `code`: Código
- `type_id`: Tipo de estado
- Relación con `core_country`

### core_business
Negocios registrados:
- `id`, `ht_data`
- `name`: Nombre del negocio
- `url_name`: Nombre para URL
- `country_id`: País del negocio
- Relación con `core_country`

### core_business_location
Ubicaciones de negocios:
- `id`, `ht_data`
- `business_id`: ID del negocio
- Datos de ubicación física

### core_product
Productos del sistema:
- `id`, `ht_data`
- `name`: Nombre del producto
- `code`: Código
- `description`: Descripción
- `type_id`: Tipo de producto

### core_product_type
Tipos de productos:
- `id`, `ht_data`
- `name`: Nombre del tipo
- `description`: Descripción

### core_user_business
Relación entre usuarios y negocios:
- `id`, `ht_data`
- `user_id`: ID del usuario
- `business_id`: ID del negocio

## Endpoints

Base URL: `http://localhost:PORT`

### Usuarios (/user)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/user/register` | Registrar nuevo usuario |
| POST | `/user/login` | Iniciar sesión |
| GET | `/user/:id` | Obtener usuario por ID |
| PATCH | `/user/update/:id` | Actualizar datos de usuario |
| PATCH | `/user/updatePass/:id` | Cambiar contraseña |
| DELETE | `/user/delete/:id` | Eliminar usuario |

### Países (/country)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/country/all` | Obtener todos los países |
| GET | `/country/byText?text=...` | Buscar países por texto |
| GET | `/country/byName?name=...` | Buscar país por nombre exacto |
| GET | `/country/:id` | Obtener país por ID |

### Estados (/state)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/state/all?country_id=...` | Obtener estados por país |
| GET | `/state/byName?name=...&country_id=...` | Buscar estado por nombre |
| GET | `/state/:id` | Obtener estado por ID |

### Negocios (/business)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/business/register` | Registrar nuevo negocio |
| GET | `/business/byUrlName?url_name=...` | Buscar negocio por URL |
| GET | `/business/:id` | Obtener negocio por ID |

### Productos (/product)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/product/all?business_id=...` | Obtener todos los productos de un negocio |
| GET | `/product/byText?business_id=...&text=...` | Buscar productos por texto (nombre, código o descripción) |
| GET | `/product/byName?business_id=...&type_id=...&name=...` | Buscar producto por nombre exacto |
| GET | `/product/:id` | Obtener producto por ID |
| POST | `/product/create` | Crear nuevo producto |
| PATCH | `/product/update/:id` | Actualizar producto por ID |
| DELETE | `/product/delete/:id` | Eliminar producto por ID (soft delete) |

## Flujo de una petición típica

1. Cliente hace petición HTTP a un endpoint
2. Express recibe la petición en Routes
3. Middlewares validan el formato y existencia de datos
4. Controller procesa la petición
5. Service ejecuta la lógica de negocio
6. Model interactúa con la base de datos
7. Respuesta regresa al cliente en formato JSON

## Ejemplo de uso

### Registrar usuario:

```http
POST /user/register
Content-Type: application/json

{
  "name": "Juan",
  "last_name": "Pérez",
  "user_name": "juanperez",
  "email": "juan@ejemplo.com",
  "password": "MiPassword123"
}
```

### Login:

```http
POST /user/login
Content-Type: application/json

{
  "login": "juan@ejemplo.com",
  "password": "MiPassword123"
}
```

Respuesta incluye JWT token para autenticación en siguientes peticiones.

### Crear producto:

```http
POST /product/create
Content-Type: application/json

{
  "type_id": 1,
  "business_id": 5,
  "name": "Laptop Dell XPS 15",
  "code": "DELL-XPS-15",
  "description": "Laptop de alto rendimiento",
  "price": 1299.99
}
```

### Buscar productos:

```http
GET /product/byText?business_id=5&text=laptop
```

### Actualizar producto:

```http
PATCH /product/update/10
Content-Type: application/json

{
  "price": 1199.99,
  "description": "Laptop de alto rendimiento - Oferta especial"
}
```

## Variables de entorno necesarias

Crear archivo `.env` con:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nombre_base_datos
DB_USER=usuario
DB_PASSWORD=contraseña
JWT_SECRET=clave_secreta_para_jwt
PROJECT_NAME=Core API
ALLOWED_DOMAINS=*
ALLOWED_METHODS=GET,POST,PUT,PATCH,DELETE
PORT=3001
```

## Cómo iniciar la API

1. Instalar dependencias: `npm install`
2. Configurar archivo `.env`
3. Crear base de datos PostgreSQL
4. Iniciar servidor: `npm run dev` (desarrollo) o `npm start` (producción)

La API estará disponible en `http://localhost:PORT`
