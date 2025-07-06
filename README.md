# 💊 MiDosis

**MiDosis** es una aplicación web desarrollada con **React** y **Firebase**, que permite a los usuarios **registrar, editar y eliminar medicamentos** de uso personal. También incluye **autenticación de usuarios**, un sistema de navegación básico y persistencia de datos en Firestore.

---

## 🚀 Tecnologías

- ⚛️ React
- 🔥 Firebase Authentication
- 📄 Cloud Firestore
- 🎨 Bootstrap + animate.css
- 🔐 Rutas protegidas con React Router
- 🧠 Context API para manejo de usuario autenticado

---

## 📷 Capturas

| Inicio de sesión | Perfil de usuario | Agregar medicamento |
|------------------|-------------------|----------------------|
| ![login](./screenshots/login.png) | ![perfil](./screenshots/perfil.png) | ![agregar](./screenshots/agregar.png) |

> 💡 *Puedes agregar estas capturas cuando las tengas listas. Guarda tus imágenes en una carpeta `screenshots/`.*

---

## ⚙️ Funcionalidades

- Registro de usuarios
- Inicio/cierre de sesión
- Mostrar nombre de usuario en navbar y perfil
- CRUD de medicamentos (agregar, listar, editar, eliminar)
- Protección de rutas: solo usuarios autenticados pueden ver su perfil
- Persistencia en Firestore con filtrado por `userId`

---

## 🧑‍💻 Instalación

1. Clona este repositorio:

```bash
git clone https://github.com/tu-usuario/midosis.git
cd midosis
