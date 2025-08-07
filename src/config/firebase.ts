// src/config/firebase.ts - Versión simplificada y robusta
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export { auth, firestore, storage };

// Tipos para mejor type safety
export interface FirebaseUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface FirebaseResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Clase Firebase Service simplificada
class FirebaseService {
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    try {
      // Verificar que Firebase esté disponible
      if (!auth || !firestore) {
        console.error('Firebase modules not available');
        return false;
      }

      // Intentar acceder a auth para verificar que esté inicializado
      await auth().currentUser;
      this.isInitialized = true;
      console.log('Firebase initialized successfully');
      return true;
    } catch (error) {
      console.error('Firebase initialization error:', error);
      return false;
    }
  }

  // Autenticación simplificada
  async signInWithEmailAndPassword(email: string, password: string): Promise<FirebaseResponse<FirebaseUser>> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return {
        success: true,
        data: {
          uid: userCredential.user.uid,
          email: userCredential.user.email || '',
          displayName: userCredential.user.displayName || undefined,
          photoURL: userCredential.user.photoURL || undefined,
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.getAuthErrorMessage(error.code)
      };
    }
  }

  async createUserWithEmailAndPassword(email: string, password: string): Promise<FirebaseResponse<FirebaseUser>> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      return {
        success: true,
        data: {
          uid: userCredential.user.uid,
          email: userCredential.user.email || '',
          displayName: userCredential.user.displayName || undefined,
          photoURL: userCredential.user.photoURL || undefined,
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.getAuthErrorMessage(error.code)
      };
    }
  }

  async signOut(): Promise<FirebaseResponse> {
    try {
      await auth().signOut();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Firestore simplificado
  async getDocument<T>(collection: string, docId: string): Promise<FirebaseResponse<T>> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const docRef = firestore().collection(collection).doc(docId);
      const doc = await docRef.get();
      
      if (doc.exists()) {
        return { success: true, data: { id: doc.id, ...doc.data() } as T };
      } else {
        return { success: false, error: 'Documento no encontrado' };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async setDocument(collection: string, docId: string, data: any, merge = true): Promise<FirebaseResponse> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      await firestore().collection(collection).doc(docId).set(data, { merge });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private getAuthErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'El email ya está en uso',
      'auth/weak-password': 'La contraseña es muy débil',
      'auth/invalid-email': 'Email inválido',
      'auth/too-many-requests': 'Demasiados intentos fallidos',
      'auth/network-request-failed': 'Error de conexión',
      'auth/invalid-credential': 'Credenciales inválidas',
    };
    return errorMessages[errorCode] || 'Error de autenticación';
  }
}

export const firebaseService = new FirebaseService();


