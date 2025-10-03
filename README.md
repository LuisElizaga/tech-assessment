# Solución Prueba Técnica - User Management System

## Cómo ejecutar

1. **Instalar dependencias:**
```bash
npm install
```

2. **Backend (NestJS):**
```bash
npm run start:backend
```
- Servidor ejecutándose en: http://localhost:3000/api
- Endpoint de status: GET /api - responde con {"message": "servidor activo"}
- API REST completa con endpoints para gestión de usuarios
- Base de datos en memoria con persistencia en DB.json

3. **Frontend (React):**
```bash
npm run start:frontend
```
- Corre en: http://localhost:4200/

## Funcionalidades Implementadas

### Backend - API REST Completa
- **CRUD completo:** Create, Read, Update, Delete (soft delete)
- Endpoint `/api/users` con paginación
- Filtrado por estado (active/inactive)
- Búsqueda por nombre, apellido, email y teléfono
- Endpoints individuales: GET, POST, PUT, PATCH
- Desactivación soft delete con `/deactivate`
- Activación con `/activate`
- Persistencia en DB.json con 5,003 usuarios
- CORS habilitado para el frontend
- Campo `username` generado automáticamente (primera letra del nombre + primer apellido)
- Límite de payload aumentado a 10MB para carga de imágenes

### Frontend - Interfaz Completa
- **Lista de usuarios** con tabla paginada
- **Perfil de usuario** con vista detallada
- **Modal de creación/edición** de usuarios
- **Modal de confirmación** para desactivar usuarios
- **Sidebar lateral** con logo Ucademy y navegación
- **Styled Components** para todos los estilos
- Diseño siguiendo especificaciones de Figma
- Carga y compresión de imágenes de perfil
- Campo username editable en modales
- Navegación entre lista y perfil de usuario
- Toggle switch para activar/desactivar usuarios
- Validación de formularios con mensajes de error
- Estados de carga y feedback visual

## Funcionalidades CRUD

### CREATE - Crear Usuario
- Modal "Nuevo alumno" con formulario completo
- Campos: Nombre, Apellidos, Username, Email, Móvil, Estado
- Username se genera automáticamente pero es editable
- Validación en tiempo real
- Avatar con opción de subir foto
- Switch para cuenta activa

### READ - Listar y Ver Usuarios
- Tabla con columnas: Estado, Nombre y apellidos, Usuario, Email, Móvil
- Vista de perfil individual con todos los detalles
- Paginación: muestra 50 usuarios por página
- Indicadores visuales de estado (Activo/Inactivo)
- Click en fila para ver perfil completo

### UPDATE - Editar Usuario
- Modal "Editar estudiante" pre-rellenado
- Todos los campos son editables incluido username
- Actualización inmediata en la lista
- Posibilidad de subir/cambiar foto de perfil

### DELETE - Desactivar Usuario (Soft Delete)
- Modal de confirmación para desactivación
- Mensaje explicativo sobre las consecuencias
- No elimina físicamente, solo cambia isActive a false
- Toggle switch para activar/desactivar desde el perfil

## Optimizaciones de Performance

1. **Paginación Backend:** Solo se envían 50 usuarios por petición
2. **useCallback y useMemo:** Para evitar re-renders innecesarios
3. **Componentes optimizados:** UserListRefBased con mejor gestión de estado
4. **Compresión de imágenes:** Reducción automática antes de guardar
5. **Filtrado en servidor:** Toda la lógica de búsqueda en el backend
6. **Lazy loading:** Carga de datos bajo demanda

## Diseño UI/UX

### Layout Principal
- Sidebar fijo a la izquierda con logo Ucademy
- Área de contenido principal con fondo gris claro
- Navegación clickeable en el menú "Alumnos"

### Lista de Usuarios
- Header con título "Alumnos" y contador de elementos
- Botón verde "Nuevo alumno" en la esquina superior derecha
- Tabla con diseño limpio y bordes redondeados
- Badges de estado con colores distintivos
- Hover effect en filas para mejor interactividad
- Paginación con botones numerados

### Perfil de Usuario
- Header con título y botón "Cerrar"
- Avatar circular con opción de cambiar foto
- Información detallada con iconos
- Toggle switch para estado de cuenta
- Botón "Editar estudiante" prominente

### Modales
- Diseño consistente con overlay oscuro
- Formularios con labels claros
- Validación visual de errores
- Botones de acción bien diferenciados

## Estructura del proyecto

```
tech-assessment/
├── Configuración del proyecto
│   ├── package.json                    # Dependencias y scripts
│   ├── package-lock.json              # Lock de dependencias
│   ├── nx.json                        # Configuración NX monorepo
│   ├── tsconfig.base.json             # TypeScript base
│   ├── jest.config.ts                 # Testing
│   └── .eslintrc.json                 # Linting rules
│
├── DB.json                            # Base de datos (5,003 usuarios)
├── README.md                          # Documentación completa
│
├── apps/backend/                      # API NestJS
│   ├── src/
│   │   ├── main.ts                    # Servidor principal (CORS, payloads)
│   │   └── app/
│   │       ├── app.module.ts          # Módulo principal
│   │       ├── app.controller.ts      # Controller base
│   │       ├── app.service.ts         # Service ("servidor activo")
│   │       └── users/                 # Módulo de usuarios
│   │           ├── users.module.ts    # Módulo usuarios
│   │           ├── users.controller.ts # Endpoints CRUD
│   │           └── users.service.ts   # Lógica de negocio
│   ├── tsconfig.json                  # TypeScript config
│   ├── jest.config.ts                 # Tests config
│   └── project.json                   # NX project config
│
└── apps/frontend/                     # React App
    ├── src/
    │   ├── main.tsx                   # Entry point
    │   ├── assets/
    │   │   └── logoUcademy.png        # Logo oficial
    │   └── app/
    │       ├── app.tsx                # App principal (navegación)
    │       ├── nx-welcome.tsx         # Componente base NX
    │       └── components/            # Componentes React
    │           ├── ConfirmModal.tsx   # Modal confirmación
    │           ├── Layout.tsx         # Layout con sidebar
    │           ├── Sidebar.tsx        # Menú lateral
    │           ├── UserListRefBased.tsx # Lista usuarios principal
    │           ├── UserModal.tsx      # Modal crear/editar
    │           └── UserProfile.tsx    # Perfil detallado
    ├── tsconfig.json                  # TypeScript config
    ├── vite.config.ts                 # Vite bundler
    └── project.json                   # NX project config
```

### Características de la estructura:

- **Limpia y organizada:** 6 componentes React (vs 14 originales)
- **Arquitectura clara:** Monorepo NX con separación backend/frontend
- **Assets mínimos:** Solo logo oficial Ucademy
- **Configuraciones optimizadas:** TypeScript, ESLint, Jest, Vite

## Endpoints API

```bash
# Listar usuarios con paginación
GET /api/users?page=1&limit=50

# Obtener usuario individual
GET /api/users/:id

# Crear nuevo usuario
POST /api/users
{
  "name": "Juan",
  "lastName": "Pérez",
  "username": "JPerez",
  "email": "juan@email.com",
  "phone": "123456789",
  "isActive": true
}

# Actualizar usuario completo
PUT /api/users/:id

# Desactivar usuario
PATCH /api/users/:id/deactivate

# Mensaje de status del servidor
GET /api
Response: { "message": "servidor activo" }
```

## Base de Datos

- **DB.json:** Contiene 5,003 usuarios
- Todos los usuarios tienen campo `username` generado
- Formato de username: Primera letra del nombre + primer apellido
- Ejemplos: "JViveros", "DHuleatt", "RLearie1"
- Persistencia automática de cambios

## Cambios Recientes Implementados

### Campo Username
- Añadido a todos los usuarios existentes en DB.json
- Generación automática con lógica personalizada
- Editable desde el frontend
- Visible en lista y perfil de usuario
- Incluido en búsquedas

### Navegación Mejorada
- Click en "Alumnos" del sidebar regresa a la lista principal
- Navegación fluida entre lista y perfiles
- Estado de vista mantenido durante la sesión

### Backend Actualizado
- Mensaje de API cambiado a "servidor activo"
- Soporte completo para campo username
- Auto-generación para usuarios sin username
- Comentarios traducidos al español

### UI/UX Refinado
- Logo oficial de Ucademy en sidebar
- Diseño consistente con brand guidelines
- Feedback visual mejorado
- Interacciones más intuitivas
- Campo de búsqueda con botón (sin pérdida de foco)

### Código Limpio y Optimizado
- Eliminados 8 componentes no utilizados
- Comentarios traducidos al español
- Console.logs de debug removidos
- Estructura de archivos simplificada

## Testing de Funcionalidades

1. **Crear usuario:** Click "Nuevo alumno", llenar formulario, verificar username autogenerado
2. **Ver perfil:** Click en cualquier fila de la tabla
3. **Editar usuario:** Desde el perfil, click "Editar estudiante"
4. **Cambiar estado:** Toggle switch en perfil o modal de edición
5. **Desactivar:** Cambiar switch a OFF, confirmar en modal
6. **Buscar:** Escribir término de búsqueda y hacer click en "Buscar" (nombre, apellido, username, email, teléfono)
7. **Navegar:** Click en "Alumnos" del sidebar para volver a lista
8. **Paginar:** Usar botones de paginación para navegar entre páginas
9. **Subir foto:** Click en avatar para seleccionar imagen

## Decisiones Técnicas

### Performance
- Paginación del lado del servidor para manejar eficientemente 5,003 usuarios
- Componentes React optimizados con hooks de memoización
- Carga diferida de imágenes con compresión automática
- Estado local para reducir llamadas al servidor

### Arquitectura
- Separación clara entre frontend y backend
- API RESTful siguiendo convenciones estándar
- Componentes reutilizables y modulares
- Gestión de estado centralizada en componentes principales

### UX/UI
- Interfaz intuitiva siguiendo patrones conocidos
- Feedback visual inmediato en todas las acciones
- Validación en tiempo real para prevenir errores
- Diseño responsive y accesible

---

**Autor:** Luis Elizaga
**Fecha:** Octubre 2025
**Tecnologías:** React + TypeScript + Styled Components + NestJS + NX