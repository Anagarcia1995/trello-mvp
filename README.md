# Trello MVP

## Funcionalidades implementadas

### Autenticación
- Registro de usuario
- Login con JWT
- Ruta protegida para comprobar autenticación (`GET /me`)
- Recuperación de contraseña (flujo MVP con token temporal)

### Boards (tablones)
- Crear tablones
- Listar tablones propios y compartidos
- Compartir tablones con otros usuarios por email
- Control de permisos (solo el owner puede compartir)

### Tasks (tareas)
- Crear tareas dentro de un tablón
- Listar tareas de un tablón
- Editar tareas (título, descripción y estado)
- Cambio de estado (`todo`, `doing`, `done`) como base para drag & drop en frontend
- Validación de permisos para evitar accesos no autorizados

---

## Stack utilizado

### Backend
- Node.js
- Express
- Sequelize
- MySQL
- JWT para autenticación
- Bcrypt para hash de contraseñas

---

## Estructura del proyecto (backend)

- `backend/src/controllers`: lógica de negocio
- `backend/src/routes`: definición de endpoints
- `backend/src/middlewares`: autenticación y autorización
- `backend/models`: modelos y relaciones Sequelize
- `backend/migrations`: estructura de base de datos

---

## Cómo ejecutar el proyecto (backend)

### Requisitos
- Node.js instalado
- MySQL instalado y en ejecución

### Pasos

```bash
cd backend
npm install
cp .env.example .env