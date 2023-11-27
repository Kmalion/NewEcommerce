# Ecommerce Web Application Camilo Florez DEMENTHO

Este proyecto es una aplicación web de comercio electrónico construida con Express.js y otras tecnologías web modernas. Proporciona funcionalidades básicas para la gestión de usuarios, productos, carritos de compras, compras y más.

## Índice

- [Configuración del Proyecto](#configuración-del-proyecto)
- [Estructura de Directorios](#estructura-de-directorios)
- [Instrucciones de Ejecución](#instrucciones-de-ejecución)
- [Rutas Principales](#rutas-principales)
- [Autenticación y Autorización](#autenticación-y-autorización)
- [Gestión de Productos](#gestión-de-productos)
- [Carritos de Compra](#carritos-de-compra)
- [Compras](#compras)
- [Módulo de Correo Electrónico](#módulo-de-correo-electrónico)

## Configuración del Proyecto

Antes de ejecutar la aplicación, asegúrate de tener Node.js y npm instalados. Luego, realiza los siguientes pasos:

1. Clona el repositorio desde GitHub.
2. Instala las dependencias con `npm install`.
3. Configura las variables de entorno según sea necesario.

...

## Rutas Principales

Aquí hay algunas rutas principales de la aplicación:

- `/view/register`: Página de registro de usuarios.
- `/`: Página principal.
- `/auth/login-auth`: Autenticación de inicio de sesión.
- `/auth/register-auth`: Autenticación de registro.
- `/view/profile`: Perfil del usuario.
- `/products`: Lista de productos.
- `/cart/add/:productId`: Agrega un producto al carrito.

...

## Autenticación y Autorización

La aplicación utiliza autenticación basada en sesiones y roles de usuario para controlar el acceso a ciertas rutas. Los usuarios administradores y premium tienen acceso a ciertas funcionalidades adicionales.

## Gestión de Productos

Las rutas relacionadas con la gestión de productos permiten a los administradores crear y eliminar productos.

## Carritos de Compra

Las rutas relacionadas con carritos de compra permiten a los usuarios agregar productos a sus carritos y realizar operaciones relacionadas con el carrito.

## Compras

La ruta `/api/:cid/purchase` se utiliza para realizar compras. Se puede acceder después de agregar productos al carrito.

## Módulo de Correo Electrónico

La aplicación tiene un módulo de correo electrónico que se utiliza para enviar mensajes relacionados con la cuenta, como restablecimiento de contraseña y notificaciones de compra.

