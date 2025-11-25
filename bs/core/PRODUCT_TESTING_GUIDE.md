# Guía de Testing: Endpoints de Productos

## Inicio Rápido (5 minutos)

### Paso 1: Iniciar el servidor
```bash
cd bs/core
npm run dev
```

El servidor debe estar corriendo en `http://localhost:3000` (o el puerto configurado)

---

## Opción A: Testing con Postman (Recomendado)

### 1. Importar la colección
1. Abrir Postman
2. Click en **Import**
3. Seleccionar el archivo: `bs/core/Product_API.postman_collection.json`
4. La colección "Product API Tests" aparecerá en el sidebar

### 2. Configurar variables
1. Click en el nombre de la colección
2. Ir a la pestaña **Variables**
3. Actualizar los valores:
   - `baseUrl`: URL del servidor (default: http://localhost:3000)
   - `businessId`: ID del negocio a usar en las pruebas (default: 1)
   - `typeId`: ID del tipo de producto (default: 1)

### 3. Ejecutar tests en orden
1. **Create Product** - Crea un producto (guarda el ID automáticamente)
2. **Get All Products by Business** - Lista productos del negocio
3. **Get Product by ID** - Obtiene un producto específico
4. **Search Products by Text** - Busca productos por texto
5. **Get Product by Name** - Busca por nombre exacto
6. **Update Product** - Actualiza información del producto
7. **Delete Product** - Elimina el producto (soft delete)

### 4. Probar casos de error
- Missing Required Fields
- Product Already Exists
- Product Not Found
- Missing Business ID

---

## Opción B: Testing con curl

### Comandos básicos de prueba

**1. Crear un producto:**
```bash
curl -X POST http://localhost:3000/product/create \
  -H "Content-Type: application/json" \
  -d '{
    "type_id": 1,
    "business_id": 1,
    "name": "Laptop Dell XPS 15",
    "code": "DELL-XPS-15",
    "description": "Laptop de alto rendimiento",
    "price": 1299.99
  }'
```

**2. Obtener todos los productos de un negocio:**
```bash
curl -X GET "http://localhost:3000/product/all?business_id=1"
```

**3. Buscar productos por texto:**
```bash
curl -X GET "http://localhost:3000/product/byText?business_id=1&text=laptop"
```

**4. Obtener producto por ID (reemplaza `123` con el ID real):**
```bash
curl -X GET http://localhost:3000/product/123
```

**5. Buscar producto por nombre exacto:**
```bash
curl -X GET "http://localhost:3000/product/byName?business_id=1&type_id=1&name=Laptop%20Dell%20XPS%2015"
```

**6. Actualizar producto:**
```bash
curl -X PATCH http://localhost:3000/product/update/123 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1199.99,
    "description": "Laptop de alto rendimiento - Oferta especial"
  }'
```

**7. Eliminar producto:**
```bash
curl -X DELETE http://localhost:3000/product/delete/123
```

---

## Opción C: Testing con PowerShell (Windows)

### Comandos para PowerShell

**1. Crear un producto:**
```powershell
$body = @{
    type_id = 1
    business_id = 1
    name = "Laptop Dell XPS 15"
    code = "DELL-XPS-15"
    description = "Laptop de alto rendimiento"
    price = 1299.99
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/product/create" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

**2. Obtener todos los productos:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/product/all?business_id=1" `
  -Method GET
```

**3. Buscar productos por texto:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/product/byText?business_id=1&text=laptop" `
  -Method GET
```

**4. Actualizar producto:**
```powershell
$updateBody = @{
    price = 1199.99
    description = "Laptop de alto rendimiento - Oferta"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/product/update/123" `
  -Method PATCH `
  -ContentType "application/json" `
  -Body $updateBody
```

---

## Secuencia de prueba completa

### Flujo de prueba básico (3 minutos)

1. **Iniciar servidor:**
```bash
npm run dev
```

2. **Crear un producto de prueba:**
```bash
curl -X POST http://localhost:3000/product/create \
  -H "Content-Type: application/json" \
  -d '{
    "type_id": 1,
    "business_id": 1,
    "name": "Producto de Prueba",
    "code": "TEST-001",
    "price": 99.99
  }'
```

**Esperado:** Status 201, retorna objeto del producto con ID

3. **Listar productos:**
```bash
curl -X GET "http://localhost:3000/product/all?business_id=1"
```

**Esperado:** Status 200, retorna array de productos

4. **Buscar el producto:**
```bash
curl -X GET "http://localhost:3000/product/byText?business_id=1&text=Prueba"
```

**Esperado:** Status 200, encuentra el producto creado

Si todo funciona, la API está lista.

---

## Casos de prueba importantes

### Happy Path (Casos exitosos)

| Endpoint | Método | Qué probar |
|----------|--------|------------|
| `/product/create` | POST | Crear producto con todos los campos |
| `/product/create` | POST | Crear producto con campos mínimos (sin code, price) |
| `/product/all` | GET | Obtener lista de productos |
| `/product/byText` | GET | Buscar por nombre/código/descripción |
| `/product/byName` | GET | Encontrar por nombre exacto |
| `/product/:id` | GET | Obtener producto específico |
| `/product/update/:id` | PATCH | Actualizar precio |
| `/product/update/:id` | PATCH | Actualizar descripción |
| `/product/delete/:id` | DELETE | Eliminar producto |

### Error Cases (Casos de error)

| Escenario | Método | Endpoint | Status Esperado |
|-----------|--------|----------|-----------------|
| Campos requeridos faltantes | POST | `/product/create` | 400 |
| Producto duplicado | POST | `/product/create` | 409 |
| Producto no encontrado | GET | `/product/99999` | 404 |
| Sin business_id | GET | `/product/all` | 400 |
| ID inválido | GET | `/product/abc` | 400 |
| Sin datos para actualizar | PATCH | `/product/update/1` | 400 |

---

## Datos de prueba sugeridos

### Producto 1: Laptop
```json
{
  "type_id": 1,
  "business_id": 1,
  "name": "Laptop Dell XPS 15",
  "code": "DELL-XPS-15",
  "description": "Laptop de alto rendimiento con procesador Intel i7",
  "price": 1299.99
}
```

### Producto 2: Mouse
```json
{
  "type_id": 1,
  "business_id": 1,
  "name": "Mouse Logitech MX Master 3",
  "code": "LOG-MX3",
  "description": "Mouse ergonómico inalámbrico",
  "price": 99.99
}
```

### Producto 3: Teclado
```json
{
  "type_id": 1,
  "business_id": 1,
  "name": "Teclado Mecánico Keychron K2",
  "code": "KEY-K2",
  "description": "Teclado mecánico RGB",
  "price": 89.99
}
```

---

## Problemas comunes y soluciones

### "Cannot connect to server"
- Verificar que el servidor esté corriendo (`npm run dev`)
- Verificar el puerto en la URL
- Revisar configuración del firewall

### "Database connection error"
- Verificar que la base de datos esté corriendo
- Revisar archivo `.env`
- Confirmar que la base de datos existe

### "Business ID is required" (400)
- Incluir `business_id` en el query string para endpoints GET
- Verificar que el ID sea un número válido

### "Product already exists" (409)
- Ya existe un producto con ese nombre y type_id en el negocio
- Usar nombre diferente o eliminar el producto existente

### "Product not found" (404)
- El ID proporcionado no existe
- Verificar el ID en la base de datos

### "Invalid ID format" (400)
- Usar ID numérico (ej: `1`, no `abc`)
- Verificar que el ID exista

---

## Verificación de Soft Delete

El endpoint DELETE hace soft delete (no elimina físicamente):

**1. Crear un producto:**
```bash
curl -X POST http://localhost:3000/product/create \
  -H "Content-Type: application/json" \
  -d '{"type_id":1,"business_id":1,"name":"Test Delete","price":10}'
```

**2. Guardar el ID retornado (ej: 100)**

**3. Eliminar el producto:**
```bash
curl -X DELETE http://localhost:3000/product/delete/100
```

**4. Verificar en base de datos:**
El producto debe tener `valid_until` con la fecha actual (no se elimina físicamente)

---

## Testing automatizado con Jest

### Instalar dependencias:
```bash
npm install --save-dev jest supertest
```

### Agregar script en package.json:
```json
{
  "scripts": {
    "test": "jest --verbose",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Crear archivo de pruebas:
Archivo: `bs/core/backend/__tests__/product.test.js`

Ver ejemplo en `user.test.js` para estructura similar.

---

## Resumen de comandos

| Tarea | Herramienta | Comando |
|-------|-------------|---------|
| Iniciar servidor | Terminal | `npm run dev` |
| Test con GUI | Postman | Importar `Product_API.postman_collection.json` |
| Test rápido | curl | Ver ejemplos arriba |
| Tests automatizados | Jest | `npm test` |

---

## Siguientes pasos

1. Probar todos los endpoints con datos válidos
2. Probar casos de error
3. Verificar soft delete en base de datos
4. Crear tests automatizados con Jest
5. Integrar pruebas en CI/CD

---

## Archivos relacionados

- `Product_API.postman_collection.json` - Colección de Postman lista para usar
- `bs/core/backend/routes/CoreProduct/CoreProductRoutes.js` - Definición de rutas
- `bs/core/backend/middlewares/mdlw_product.js` - Validaciones
- `bs/core/backend/controllers/ctrl_product.js` - Controladores
- `bs/core/backend/services/svc_CoreProduct.js` - Lógica de negocio
- `bs/core/API_DOCUMENTATION.md` - Documentación completa de la API

---

## Necesitas ayuda?

- Revisa la documentación: `API_DOCUMENTATION.md`
- Verifica los logs del servidor para detalles de errores
- Revisa el estado de la base de datos con un cliente SQL
- Consulta los archivos de ejemplo de usuario (`User_API.postman_collection.json`)

**Feliz Testing!**

