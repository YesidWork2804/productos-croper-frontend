# 🛒 Catálogo de Productos - Frontend

Aplicación web moderna desarrollada con Angular 17 para gestionar un catálogo de productos con autenticación JWT y diseño responsivo.

## 🚀 Características Principales

- **🔐 Autenticación completa** - Login, registro y gestión de sesiones
- **📦 CRUD de productos** - Crear, leer, actualizar y eliminar productos
- **🔍 Búsqueda y filtros** - Filtrado por categoría y búsqueda de texto
- **📱 Diseño responsivo** - Optimizado para desktop, tablet y móvil
- **🏪 Gestión de estado** - NgRx para manejo centralizado del estado
- **🎨 UI** - Angular Material Design

## 🛠️ Stack Tecnológico

- **Framework:** Angular 17 (Standalone Components)
- **Estado:** NgRx (Store, Effects, Selectors)
- **UI:** Angular Material + CDK
- **Estilos:** SCSS + CSS Grid/Flexbox
- **HTTP:** Angular HttpClient con interceptors
- **Routing:** Angular Router con guards
- **Validación:** Reactive Forms + Custom Validators


## 🔧 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm 9+
- Angular CLI 17+

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd productos-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
# src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'  # URL de tu API backend
};
```

### 4. Ejecutar la aplicación

```bash
# Desarrollo con hot-reload
npm start
# o
ng serve

# La aplicación estará disponible en http://localhost:4200
```

## 🔗 Conexión con el Backend

### Configuración de la API

1. **Asegúrate de que el backend esté ejecutándose** en `http://localhost:3000`

2. **Verifica la configuración** en `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000'  // URL del backend
   };
   ```

3. **El frontend se conecta automáticamente** a estos endpoints:
   ```
   POST /auth/login          # Iniciar sesión
   POST /auth/register       # Registrar usuario
   GET  /products           # Listar productos (con filtros)
   POST /products           # Crear producto
   GET  /products/:id       # Obtener producto
   PATCH /products/:id      # Actualizar producto
   DELETE /products/:id     # Eliminar producto
   GET  /products/categories # Obtener categorías
   ```

### Configuración de CORS (si es necesario)

Si tienes problemas de CORS, agrega esto en tu backend:

```typescript
// En main.ts del backend NestJS
app.enableCors({
  origin: 'http://localhost:4200',
  credentials: true
});
```

### Autenticación JWT

El frontend maneja automáticamente:
- ✅ Almacenamiento del token JWT en localStorage
- ✅ Envío automático del token en headers de peticiones
- ✅ Redirección al login si el token expira
- ✅ Gestión del estado de autenticación

## 🎮 Uso de la Aplicación

### 1. Autenticación

**Credenciales de prueba:**
- **Email:** `admin@test.com`
- **Password:** `password123`

**O crear cuenta nueva:**
1. Ve a la página de registro
2. Completa el formulario
3. Serás redirigido automáticamente

### 2. Gestión de Productos

**Listar productos:**
- Vista principal con grid responsivo
- Filtros por categoría y búsqueda
- Paginación configurable

**Crear producto:**
1. Click en "Nuevo Producto"
2. Completa el formulario con validaciones
3. Vista previa en tiempo real

**Editar producto:**
1. Click en "Editar" en cualquier producto
2. Formulario pre-poblado
3. Guarda los cambios

**Eliminar producto:**
1. Click en "Eliminar"
2. Confirma en el diálogo
3. Eliminación inmediata


## 🔐 Seguridad Implementada

- **JWT Token Management** - Almacenamiento seguro y renovación
- **Route Guards** - Protección de rutas autenticadas
- **HTTP Interceptors** - Manejo automático de autenticación
- **Form Validation** - Validaciones client-side robustas
- **XSS Protection** - Sanitización de datos de entrada

## 🚀 Despliegue

### Build de Producción

```bash
# Crear build optimizado
npm run build

# Los archivos estarán en dist/productos-frontend/
```

### Variables de Entorno de Producción

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://tu-api-produccion.com'
};
```

### Ejemplo con Nginx

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/productos-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://tu-backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📈 Próximas Mejoras

- [ ] **PWA Support** - Funcionalidad offline
- [ ] **Internacionalización** - Soporte multi-idioma
- [ ] **Tema oscuro** - Modo oscuro/claro
- [ ] **Upload de imágenes** - Gestión de archivos
- [ ] **Notificaciones push** - Alertas en tiempo real
- [ ] **Tests E2E** - Cobertura completa de tests
- [ ] **Analytics** - Métricas de uso
