#  jutcall – Ionic + Firebase

Una aplicación móvil construida con **Ionic + Angular** que permite a los usuarios registrarse, iniciar sesión y guardar contactos personales. Se utiliza **Firebase Authentication** para la autenticación de usuarios y **Cloud Firestore** para almacenar los datos.

---

##  Funcionalidades

- Registro de usuario con correo y contraseña 
- Inicio de sesión seguro   
- Agregar números de contacto   
- Guardado de datos en tiempo real con Firebase Firestore ☁  
- Navegación entre pantallas usando Ionic Router ↔ 
- Logout de sesión 

---

##  Tecnologías Usadas

- [Ionic Framework](https://ionicframework.com/)
- [Angular](https://angular.io/)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Capacitor](https://capacitorjs.com/) para compilar en Android

---

##  Configuración Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. Habilita **Authentication** → proveedor "Email/Password".
3. Habilita **Firestore Database** y colócalo en modo de prueba (desarrollo).
4. Descarga el archivo `google-services.json` y colócalo en `android/app/`.

---

## Compilar para Android


# Instala dependencias
npm install

# Ejecuta en navegador
ionic serve

# Para Android
ionic build
npx cap add android
npx cap open android


