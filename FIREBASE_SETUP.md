# Configuración de Firebase para React Native

## Pasos para configurar Firebase en tu proyecto

### 1. Crear un proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto"
3. Dale un nombre a tu proyecto (ej: "project00")
4. Sigue los pasos de configuración

### 2. Configurar la aplicación Android

1. En Firebase Console, ve a "Configuración del proyecto" > "General"
2. En la sección "Tus aplicaciones", haz clic en el ícono de Android
3. Ingresa el nombre del paquete: `com.project00`
4. Descarga el archivo `google-services.json`
5. Coloca el archivo en `android/app/google-services.json`

### 3. Configurar la aplicación iOS

1. En Firebase Console, ve a "Configuración del proyecto" > "General"
2. En la sección "Tus aplicaciones", haz clic en el ícono de iOS
3. Ingresa el Bundle ID: `com.project00`
4. Descarga el archivo `GoogleService-Info.plist`
5. Coloca el archivo en `ios/project00/GoogleService-Info.plist`

### 4. Actualizar la configuración

Reemplaza los valores en los siguientes archivos con los datos reales de tu proyecto Firebase:

#### `android/app/google-services.json`
- `YOUR_PROJECT_NUMBER`
- `YOUR_PROJECT_ID`
- `YOUR_APP_ID`
- `YOUR_CLIENT_ID`
- `YOUR_API_KEY`

#### `ios/project00/GoogleService-Info.plist`
- `YOUR_API_KEY`
- `YOUR_SENDER_ID`
- `YOUR_PROJECT_ID`
- `YOUR_APP_ID`

#### `src/config/firebase.ts`
- `YOUR_API_KEY`
- `YOUR_PROJECT_ID`
- `YOUR_SENDER_ID`
- `YOUR_APP_ID`

### 5. Instalar dependencias

```bash
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
```

### 6. Configurar reglas de Firestore

En Firebase Console, ve a Firestore Database > Reglas y configura las reglas básicas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 7. Habilitar Authentication

En Firebase Console, ve a Authentication > Sign-in method y habilita:
- Email/Password
- Google (opcional)
- Phone (opcional)

### 8. Probar la configuración

1. Ejecuta `npx react-native run-android` o `npx react-native run-ios`
2. Prueba el login con un usuario creado en Firebase Console

## Funciones disponibles

### Autenticación
- `signInWithEmailAndPassword(email, password)`
- `createUserWithEmailAndPassword(email, password)`
- `signOut()`

### Firestore
- `addDocument(collection, data)`
- `getDocument(collection, docId)`
- `updateDocument(collection, docId, data)`
- `deleteDocument(collection, docId)`
- `getCollection(collection)`

## Ejemplo de uso

```typescript
import { signInWithEmailAndPassword, addDocument } from '../config/firebase';

// Login
const handleLogin = async () => {
  const result = await signInWithEmailAndPassword(email, password);
  if (result.success) {
    console.log('Login exitoso');
  } else {
    console.log('Error:', result.error);
  }
};

// Agregar documento
const handleAddUser = async () => {
  const userData = {
    name: 'Juan Pérez',
    email: 'juan@example.com',
    createdAt: new Date()
  };
  
  const result = await addDocument('users', userData);
  if (result.success) {
    console.log('Usuario creado con ID:', result.id);
  }
};
```

## Solución de problemas

### Error: "Firebase App named '[DEFAULT]' already exists"
Este error es normal, Firebase se auto-inicializa. No necesitas llamar a `firebase.initializeApp()`.

### Error: "Missing google-services.json"
Asegúrate de que el archivo `google-services.json` esté en `android/app/` y que contenga los datos correctos.

### Error: "Missing GoogleService-Info.plist"
Asegúrate de que el archivo `GoogleService-Info.plist` esté en `ios/project00/` y que contenga los datos correctos.

### Error de permisos en Android
Verifica que el plugin de Google Services esté aplicado en `android/app/build.gradle`. 