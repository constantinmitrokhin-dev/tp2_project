🧩 User Story 1.1 — Registro de usuario

Como nuevo usuario
quiero registrarme en la aplicación ingresando mis datos personales (nombre, apellido, correo y contraseña)
para poder acceder al sistema y registrar mi negocio o productos.

Criterios de aceptación:

✅ El sistema debe validar que el correo sea único.

✅ La contraseña debe tener al menos 8 caracteres.

✅ Si el registro es exitoso, el sistema debe devolver un token de autenticación o confirmar el alta.

✅ Si el correo ya existe, debe mostrar un mensaje de error.

Campos esperados:

first_name

last_name

email (único)

password

🧩 User Story 1.2 — Login

Como usuario registrado
quiero iniciar sesión con mi correo y contraseña
para acceder a mis datos y gestionar mis productos.

Criterios de aceptación:

✅ El sistema debe validar el correo y la contraseña.

✅ Si los datos son correctos, debe devolver un token JWT (o sesión activa).

✅ Si los datos son incorrectos, debe mostrar un mensaje de error.

✅ El token debe permitir acceder solo a los endpoints protegidos.

🧩 User Story 1.3 — Logout

Como usuario autenticado
quiero cerrar sesión de forma segura
para proteger mis datos al salir de la aplicación.

Criterios de aceptación:

✅ El token o sesión debe invalidarse al cerrar sesión.

✅ El usuario debe ser redirigido a la pantalla de inicio.

🧩 User Story 1.4 — Recuperar contraseña (opcional en MVP)

Como usuario registrado
quiero poder recuperar mi contraseña mediante mi correo electrónico
para volver a acceder a mi cuenta si la olvido.

Criterios de aceptación:

✅ El usuario ingresa su correo.

✅ El sistema envía un link o token de recuperación temporal.

✅ El usuario puede establecer una nueva contraseña válida.

🧭 Épica 2: Gestión de Productos
🎯 Objetivo

Permitir que los usuarios autenticados registren, editen, visualicen y eliminen productos asociados a su negocio.

🧩 User Story 2.1 — Crear producto

Como usuario autenticado (dueño del negocio)
quiero registrar un nuevo producto ingresando su nombre, tipo, descripción, precio y fecha de validez
para ofrecerlo en mi tienda virtual.

Criterios de aceptación:

✅ Todos los campos requeridos deben estar completos:

name, type_id, price, valid_until

✅ El type_id debe referenciar un tipo de producto existente (CORE_PRODUCT_TYPE).

✅ El producto debe vincularse al negocio activo (business_id).

✅ El sistema debe devolver confirmación de creación con el ID del producto.

✅ Los precios deben ser numéricos y positivos.

🧩 User Story 2.2 — Listar productos

Como usuario autenticado
quiero ver un listado de todos mis productos registrados
para gestionar fácilmente los que están activos o inactivos.

Criterios de aceptación:

✅ La lista solo debe incluir productos del usuario autenticado.

✅ El sistema debe mostrar: nombre, tipo, precio, estado, y fecha de validez.

✅ Se debe poder filtrar por tipo o estado de validez.

🧩 User Story 2.3 — Editar producto

Como usuario autenticado
quiero modificar los datos de un producto existente
para actualizar su información o precio.

Criterios de aceptación:

✅ El sistema debe validar que el producto pertenece al usuario.

✅ Solo se deben poder editar los campos name, type_id, price, valid_until.

✅ Los cambios deben reflejarse inmediatamente en el listado.

🧩 User Story 2.4 — Eliminar producto

Como usuario autenticado
quiero eliminar un producto que ya no ofrezco
para mantener mi catálogo actualizado.

Criterios de aceptación:

✅ El sistema debe validar que el producto pertenece al usuario.

✅ Una vez eliminado, no debe aparecer en el listado.

✅ Si se intenta eliminar un producto inexistente, debe mostrar un error.

🧩 User Story 2.5 — Consultar detalle de producto

Como usuario autenticado
quiero ver la información completa de un producto específico
para revisar sus características y datos antes de editarlo.

Criterios de aceptación:

✅ El sistema debe devolver todos los datos del producto (name, type, price, valid_until, code).

✅ Solo el dueño del producto debe poder acceder a este endpoint.

🧩 User Story 2.6 — Validación de vigencia de productos

Como sistema
quiero marcar automáticamente los productos con fecha de validez vencida
para que no aparezcan como activos.

Criterios de aceptación:

✅ Los productos con valid_until < current_date deben cambiar su estado a inactivo.

✅ Los productos inactivos no deben mostrarse en el listado principal.