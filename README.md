# 🏠 Martillero Público Frontend

Aplicación **Angular 17** desarrollada para el sistema **Martillero Público**, encargada de gestionar y visualizar propiedades, autenticación de usuarios, contacto y servicios del estudio.  
El frontend se comunica con la API REST .NET 8 desplegada en Azure y se publica como sitio estático en **AWS S3**, con distribución por **CloudFront** y SSL provisto por **Route 53 + Certificate Manager**.

---

## 🌐 Enlaces principales

| Tipo | Enlace |
|------|---------|
| 🌍 **Sitio en producción** | [https://www.zmpropiedades.com/](https://www.zmpropiedades.com/) *(CloudFront + SSL)* |
| ⚙️ **API Backend (Azure)** | [https://martilleropublico-api-app.gentlecoast-0f9fc459.eastus.azurecontainerapps.io/api/](https://martilleropublico-api-app.gentlecoast-0f9fc459.eastus.azurecontainerapps.io/api/) |
| 🧠 **Repositorio Backend** | [GitHub - MartilleroPublico.API](#) *(https://github.com/BudnikMilton93/martilleropublico-NET8-API.git)* |
| 💾 **Repositorio Frontend** | [GitHub - MartilleroPublico.Front](#) *(este repo)* |

---

## ⚙️ Tech Stack

| Categoría | Tecnologías |
|------------|-------------|
| 🧩 **Framework principal** | Angular 17 + TypeScript 5.4 |
| 🎨 **Estilos y UI** | TailwindCSS 3.4 + Bootstrap 5 + Font Awesome |
| 🔑 **Autenticación** | JWT (con Interceptor + Guard) |
| 🧠 **Gestión de datos** | Servicios HTTP hacia API .NET 8 (Azure) |
| ☁️ **Infraestructura** | AWS S3 (Hosting) + CloudFront (CDN) + Route53 (DNS) + ACM (SSL) |
| 📤 **Email & Forms** | EmailJS integrado |
| 🧰 **Herramientas** | Node 22.19 · npm 10.9 · RxJS 7.8 · Zone.js 0.14 |

---

## 🏗️ Arquitectura del proyecto

El frontend sigue una arquitectura **modular y escalable**, aplicando buenas prácticas de separación de responsabilidades.

```plaintext
martilleropublico-angular-web/
│
├── app/
│   ├── components/       → Vistas y componentes principales
│   ├── core/             → Configuración global e interceptores
│   ├── guards/           → Protección de rutas (AuthGuard)
│   ├── models/           → Tipos y modelos de datos
│   ├── services/         → Conexión con la API y lógica de negocio
│   ├── shared/           → Recursos reutilizables (toasts, animaciones)
│   └── mocks/            → Datos de prueba y simulación
│
├── assets/               → Imágenes, íconos, robots.txt, sitemap.xml
├── environments/         → Configuración local y productiva
└── styles.scss           → Estilos globales + Tailwind
```

### 📁 Descripción de carpetas principales
| Carpeta | Descripción |
|-------------|----------|
|components |	Contiene los componentes visuales principales del sitio: home, propiedades, login, contacto, etc.|
|core |	Módulos globales, interceptores y configuración base del app.|
|guards |	Contiene los guards de autenticación (protege rutas privadas).|
|interceptors |	Intercepta peticiones HTTP para agregar el token JWT automáticamente.|
|mocks |	Datos simulados para tests o previsualización.|
|models |	Definición de interfaces y modelos de datos (Propiedad, Contacto, etc.).|
|services |	Servicios de comunicación con la API y manejo de lógica de negocio.|
|shared |	Utilidades y componentes reutilizables (como animaciones, toast, etc.).|
|assets |	Archivos estáticos, imágenes, íconos y metadatos del sitio.|
|environments |	Configuraciones de entorno (environment.ts y environment.prod.ts).|

---

### 🔑 Autenticación JWT

El frontend utiliza autenticación JWT basada en:
- auth.service.ts: maneja login/logout y almacenamiento del token.
- auth.interceptor.ts: adjunta el token en cada request HTTP.
- auth.guard.ts: protege las rutas según si el usuario está autenticado.
- El token es emitido por la API .NET desplegada en Azure.

---

### ⚙️ Configuración de entornos

Archivo src/environments/environment.ts:
<pre> 
export const environment = {
  production: false,
  apiUrl: 'https://martilleropublico-api.azurewebsites.net/api',
  imageBucketUrl: 'https://martilleropublico-images.s3.amazonaws.com/'
};
 </pre>
Y su versión para producción (environment.prod.ts) apunta a los mismos servicios en la nube.

---

### 🧠 Instalación y ejecución local

Cloná el repositorio y ejecutá:
- npm install
Para levantar en modo desarrollo:
- ng serve
El proyecto correrá en:
- http://localhost:4200/

---

### 🚀 Build y despliegue en AWS

1️⃣ Generar build de producción
<pre> ng build --configuration production </pre>
El contenido compilado quedará en la carpeta dist/martilleropublico-angular-web.

2️⃣ Subir a S3
<pre> aws s3 sync dist/martilleropublico-angular-web s3://martilleropublico-frontend --delete </pre>

3️⃣ Invalidar caché de CloudFront
<pre> 
 aws cloudfront create-invalidation \
  --distribution-id ABCDEFG12345 \
  --paths "/*"
</pre>

4️⃣ Infraestructura asociada
- S3: hosting estático.
- CloudFront: CDN global y cache.
- Route 53: dominio personalizado.
- Certificate Manager: HTTPS habilitado.
- S3 secundario: almacenamiento de imágenes de propiedades.

---

### 💡 Decisiones técnicas

- Angular 17 + TypeScript 5.4: framework moderno, robusto y mantenible.
- Tailwind + Bootstrap: combinación entre diseño utilitario y componentes predefinidos.
- JWT + Interceptors: seguridad y autenticación centralizada.
- EmailJS: envío de formularios de contacto sin backend adicional.
- AWS Cloud Stack: rendimiento, escalabilidad y disponibilidad global.
- Arquitectura modular: componentes reutilizables y separación clara de responsabilidades.

---

### 🧱 Áreas de mejora

- Implementar pipeline CI/CD automático (GitHub Actions o Azure DevOps).
- Configurar lazy loading para mejorar performance inicial.
- Añadir PWA support (Progressive Web App).
- Agregar test unitarios y e2e con Jest / Cypress.
- Integrar un módulo de analytics para métricas de tráfico.
