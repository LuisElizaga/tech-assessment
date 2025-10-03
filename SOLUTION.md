# Solución Prueba Técnica - User Management System (CRUD Completo)

## 🚀 Cómo ejecutar

1. **Backend (NestJS):**
```bash
npm run start:backend
```
- Corre en: http://localhost:3000/api

2. **Frontend (React):**
```bash
npm run start:frontend
```
- Corre en: http://localhost:4200/

## 📋 Funcionalidades Implementadas

### Backend - API REST Completa
- ✅ **CRUD completo:** Create, Read, Update, Delete (soft delete)
- ✅ Endpoint `/api/users` con paginación
- ✅ Filtrado por estado (active/inactive)
- ✅ Búsqueda por nombre, apellido, email y teléfono
- ✅ Endpoints individuales: GET, POST, PUT, PATCH
- ✅ Desactivación soft delete con `/deactivate`
- ✅ Activación con `/activate`
- ✅ Persistencia en DB.json
- ✅ CORS habilitado para el frontend

### Frontend - Interfaz Completa tipo Ucademy
- ✅ **Lista de usuarios** con React
- ✅ **Modal de creación/edición** de usuarios
- ✅ **Modal de confirmación** para desactivar usuarios
- ✅ **Styled Components** para todos los estilos
- ✅ Diseño idéntico a la interfaz mostrada en Figma
- ✅ Botón "Nuevo alumno" para crear usuarios
- ✅ Botones "Editar" y "Desactivar" por usuario
- ✅ Búsqueda en tiempo real con debounce (300ms)
- ✅ Filtro por estado activo/inactivo
- ✅ Paginación estilo Ucademy (50 usuarios por página)
- ✅ Validación de formularios con errores
- ✅ Avatar placeholder en modales
- ✅ Switch para estado activo/inactivo
- ✅ Estados de carga y error

## 🔧 Funcionalidades CRUD

### ✅ CREATE - Crear Usuario
- Modal "Nuevo alumno" con formulario completo
- Campos: Nombre, Apellidos, Email, Móvil, Estado
- Validación en tiempo real
- Avatar placeholder
- Switch para cuenta activa

### ✅ READ - Listar Usuarios
- Tabla con formato Ucademy
- Columnas: Nombre y apellidos, Usuario, Email, Móvil, Estado, Acciones
- Paginación: "X - Y de Z elementos"
- Búsqueda y filtros

### ✅ UPDATE - Editar Usuario
- Modal "Editar estudiante" pre-rellenado
- Mismo formulario que creación
- Actualización inmediata en la lista

### ✅ DELETE - Desactivar Usuario (Soft Delete)
- Modal de confirmación: "¿Seguro que quieres desactivar esta cuenta?"
- Mensaje: "El usuario dejará de tener acceso a la plataforma"
- Botones: "Cancelar" y "Desactivar"
- No elimina físicamente, solo cambia isActive a false

## ⚡ Optimizaciones de Performance

1. **Paginación Backend:** Solo se envían 50 usuarios por petición
2. **Debounce en búsqueda:** Evita peticiones excesivas (300ms delay)
3. **useCallback y useMemo:** Para evitar re-renders innecesarios
4. **Filtrado en servidor:** Toda la lógica de filtrado se hace en el backend
5. **Validación inmediata:** Feedback instantáneo en formularios
6. **Optimistic updates:** UI se actualiza antes de confirmar en servidor

## 🎨 Diseño UI/UX

### Interfaz Principal (Lista)
- Header con título "Alumnos" y contador "X elementos"
- Botón verde "Nuevo alumno" estilo Ucademy
- Barra de búsqueda y filtros
- Tabla con hover effects
- Badges de estado (Verde=Activo, Rojo=Inactivo)
- Botones de acción: "Editar" (azul) y "Desactivar" (rojo)

### Modal de Usuario
- Header con título dinámico
- Avatar placeholder
- Formulario completo con validación
- Switch para estado activo
- Botones: "Cancelar" (gris) y "Crear estudiante"/"Guardar" (verde)

### Modal de Confirmación
- Icono de advertencia
- Título claro
- Mensaje explicativo
- Botones: "Cancelar" (gris) y "Desactivar" (rojo)

## 📁 Estructura de archivos CRUD

```
apps/
├── backend/
│   └── src/
│       └── app/
│           └── users/
│               ├── users.controller.ts (+ CRUD endpoints)
│               ├── users.service.ts (+ CRUD methods)
│               └── users.module.ts
└── frontend/
    └── src/
        └── app/
            └── components/
                ├── UserListCRUD.tsx (interfaz completa)
                ├── UserModal.tsx (crear/editar)
                ├── ConfirmModal.tsx (confirmación)
                ├── UserList.tsx (solo lectura)
                └── UserListSimple.tsx (versión básica)
```

## 🔗 Endpoints API CRUD

```bash
# Listar usuarios (con filtros y paginación)
GET /api/users?page=1&limit=50&search=john&isActive=true

# Obtener usuario individual
GET /api/users/:id

# Crear nuevo usuario
POST /api/users
{
  "name": "Juan",
  "lastName": "Pérez",
  "email": "juan@email.com",
  "phone": "123456789",
  "isActive": true
}

# Actualizar usuario
PUT /api/users/:id
{
  "name": "Juan Carlos",
  "lastName": "Pérez García"
}

# Desactivar usuario (soft delete)
PATCH /api/users/:id/deactivate

# Activar usuario
PATCH /api/users/:id/activate
```

## 🧪 Testing CRUD

1. **Crear:** Click "Nuevo alumno" → Llenar formulario → "Crear estudiante"
2. **Leer:** Lista se actualiza automáticamente
3. **Editar:** Click "Editar" → Modificar datos → "Guardar"
4. **Desactivar:** Click "Desactivar" → Confirmar → Usuario queda inactivo
5. **Buscar:** Funciona en tiempo real con todos los campos
6. **Filtrar:** Dropdown de estado funciona correctamente
7. **Paginar:** Navegación entre páginas mantiene filtros

## 💡 Mejoras Implementadas vs Versión Anterior

### Nuevas Funcionalidades:
- ✅ CRUD completo vs solo lectura
- ✅ Modales interactivos vs tabla estática
- ✅ Confirmación de acciones vs acciones directas
- ✅ Validación de formularios vs sin validación
- ✅ Persistencia de datos vs datos en memoria
- ✅ Soft delete vs hard delete
- ✅ Diseño Ucademy vs diseño genérico

### Mejor UX:
- ✅ Feedback inmediato en formularios
- ✅ Estados de carga durante operaciones
- ✅ Mensajes de confirmación claros
- ✅ Navegación intuitiva
- ✅ Diseño responsivo

---

**Autor:** Luis Elizaga
**Fecha:** Octubre 2025
**Tecnologías:** React + TypeScript + Styled Components + NestJS + Axios