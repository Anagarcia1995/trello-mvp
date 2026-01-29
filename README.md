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



----------------------------


# Trello MVP

Proyecto MVP inspirado en Trello, desarrollado como prueba técnica, con foco en
funcionalidad, control de permisos y claridad de código.

---

## Funcionalidades implementadas

### Autenticación
- Registro de usuario
- Login con JWT
- Persistencia de sesión
- Ruta protegida para comprobar autenticación (`GET /me`)
- Recuperación de contraseña (flujo MVP con token temporal)

### Boards (tablones)
- Crear tablones
- Listar tablones propios y compartidos
- Compartir tablones con otros usuarios por email
- Control de permisos para acceder a un tablón compartido

### Tasks (tareas)
- Crear tareas dentro de un tablón
- Listar tareas de un tablón
- Cambio de estado (`todo`, `doing`, `done`) mediante Drag & Drop
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

### Frontend
- React
- Vite
- Chakra UI
- React Router
- Drag & Drop con `@dnd-kit`
- Comunicación con API mediante `fetch`

---

## Estructura del proyecto

### Backend
- `backend/src/controllers`: lógica de negocio
- `backend/src/routes`: definición de endpoints
- `backend/src/middlewares`: autenticación y autorización
- `backend/models`: modelos y relaciones Sequelize
- `backend/migrations`: estructura de base de datos

### Frontend
- `frontend/src/pages`: páginas principales
- `frontend/src/components`: componentes reutilizables
- `frontend/src/auth`: contexto de autenticación y rutas protegidas
- `frontend/src/api`: cliente de comunicación con el backend

---

## Cómo ejecutar el proyecto

### Requisitos
- Node.js
- MySQL

## Usuarios de prueba

Para facilitar la validación del proyecto, se pueden utilizar los siguientes
usuarios de prueba ya registrados en la base de datos:

- **Email:** 
ana@ana.com            123
pilar@pilar.com        123
maria@maria.com        123
candela@candela.com    123

También es posible crear nuevos usuarios mediante el formulario de registro.

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev


