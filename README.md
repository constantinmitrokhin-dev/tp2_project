
# TP - Taller de Programación 2

## Integrantes

* Constantin Mitrokhin
* Guido Agustín Verde

## Tecnologías Utilizadas

### El proyecto utiliza las siguientes librerías y herramientas:

- **express** (^5.1.0) → Framework para construir el servidor web y manejar rutas.
- **body-parser** (^2.2.0) → Middleware para procesar cuerpos de peticiones HTTP (JSON, urlencoded).
- **cookie-parser** (^1.4.7) → Manejo de cookies en las peticiones HTTP.
- **cors** (^2.8.5) → Habilita y configura el uso de CORS para acceso entre dominios.
- **dotenv** (^17.2.2) → Carga variables de entorno desde un archivo `.env`.
- **morgan** (^1.10.1) → Middleware de logging para registrar las peticiones HTTP.
- **pg** (^8.16.3) → Cliente oficial de PostgreSQL para Node.js.
- **pg-hstore** (^2.3.4) → Serializador para almacenar objetos JavaScript en PostgreSQL (tipo HSTORE).
- **pgtools** (^1.0.1) → Herramientas auxiliares para la gestión de bases de datos PostgreSQL.
- **sequelize** (^6.37.7) → ORM para trabajar con PostgreSQL mediante modelos en JavaScript.

### ⚙️ Dependencias de desarrollo
- **nodemon** (^3.1.10) → Reinicia automáticamente el servidor al detectar cambios en el código durante el desarrollo.
## Estructura del Proyecto

```
TP2_PROJECT/
├── bs/
│   ├── core/				# Módulo Central.
│   │   ├── backend/			# Sub-Módulos DB.
│   │   ├── frontend/			# Sub-Módulos UI.
│   │   ├── config.json			# Establece el órden de prioridad y dependencias.
│   ├── inventory/			# Módulo de Gestión del Inventario.
│   │   ├── backend/			# Sub-Módulos DB.
│   │   ├── frontend/			# Sub-Módulos UI.
│   │   ├── config.json			# Establece el órden de prioridad y dependencias.
│
├── package.json			# Dependencias principales
├── README.md				# Documentación
└── UserStories.md			# Historias de usuario
```