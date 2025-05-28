# 📞 JitCall - Aplicación de Videollamadas en Ionic + Angular

Esta aplicación permite realizar videollamadas entre usuarios utilizando Firebase, autenticación con Supabase, notificaciones push y almacenamiento de imágenes de perfil.

## 🚀 Tecnologías usadas

- [Ionic Framework](https://ionicframework.com/)
- [Angular](https://angular.io/)
- [Firebase (Firestore + FCM)](https://firebase.google.com/)
- [Supabase (Auth + Storage)](https://supabase.io/)
- [Capacitor](https://capacitorjs.com/)
- [WebRTC](https://webrtc.org/) para videollamadas

---

## 📦 Instalación

``bash
npm install

⚙️ Configuración
1. Firebase
src/environments/environment.ts:

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyACorTCoyzhtybr_iQVXS-DPUdrksFba74',
    authDomain: 'parcial2-e6e12.firebaseapp.com',
    projectId: 'parcial2-e6e12',
    storageBucket: 'parcial2-e6e12.appspot.com',
    messagingSenderId: '545067667004',
    appId: '1:545067667004:web:fe8472111df8b2adbb7d39',
    measurementId: 'G-X9XMRRPGJQ',
  },
  notifications: 'https://ravishing-courtesy-production.up.railway.app/',
  notificationUser: {
    email: 'admin@admin.com',
    password: '12345678',
  },
  supabaseConfig: {
    url: 'https://unfhhqxfplhjytupvucj.supabase.co', 
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuZmhocXhmcGxoanl0dXB2dWNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNjM0ODIsImV4cCI6MjA2MjYzOTQ4Mn0.uqmiHNVSy5dfcdv9nOWKCx71LskymBlEm4H6DAFWinw', // <-- remplaza con tu clave real
  },
};



Autenticación
La autenticación se maneja con Supabase

Registro y login de usuario

Token del usuario se guarda en LocalStorage

Se recupera el token FCM para notificaciones


Notificaciones Push
Se obtiene el token FCM mediante Capacitor

Se guarda el token en Firestore


🧪 Ejecutar en Android
bash
Copiar
Editar
ionic build
npx cap sync
npx cap open android
Revisa los permisos de cámara, micrófono y notificaciones en el dispositivo.

Estructura principal

src/
│
├── app/
│   ├── core/
│   ├── guards/
│   ├── pages/
│   │   ├── login/
│   │   ├── register/
│   │   ├── home/
│   │   └── chat/
│   │   └── add-contact/
│   │   └── call/
│   │   └── contact/
│   │   └── dashboard/
│   │   └── edit-contact/
│   │   └── start-call/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── notification.service.ts
│   │   └── bucket.service.ts
│   │   └── contact.service.ts
│   │   └── interceptor.service.ts
│   └── interfaces/
│       └── user.ts
│       └── contact.ts
│       └── message.ts
│
└── environments/
    └── environment.ts
    
👨‍💻 Autor
Anderson Castilla
