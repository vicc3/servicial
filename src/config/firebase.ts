// src/config/firebase.ts - Versión optimizada
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

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

// Clase Firebase Service para centralizar operaciones
class FirebaseService {
  // Autenticación
  async signInWithEmailAndPassword(email: string, password: string): Promise<FirebaseResponse<FirebaseUser>> {
    try {
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

  // Firestore optimizado con cache
  async getDocument<T>(collection: string, docId: string, useCache = true): Promise<FirebaseResponse<T>> {
    try {
      const docRef = firestore().collection(collection).doc(docId);
      const doc = useCache 
        ? await docRef.get({ source: 'cache' }).catch(() => docRef.get({ source: 'server' }))
        : await docRef.get({ source: 'server' });
      
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
      await firestore().collection(collection).doc(docId).set(data, { merge });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateDocument(collection: string, docId: string, data: any): Promise<FirebaseResponse> {
    try {
      await firestore().collection(collection).doc(docId).update({
        ...data,
        updatedAt: firestore.FieldValue.serverTimestamp()
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Consultas optimizadas con paginación
  async getCollectionWithPagination<T>(
    collection: string, 
    limit = 20, 
    startAfter?: FirebaseFirestoreTypes.DocumentSnapshot,
    orderBy?: { field: string; direction: 'asc' | 'desc' }
  ): Promise<FirebaseResponse<{ documents: T[]; lastDoc?: FirebaseFirestoreTypes.DocumentSnapshot }>> {
    try {
      let query: FirebaseFirestoreTypes.Query = firestore().collection(collection);
      
      if (orderBy) {
        query = query.orderBy(orderBy.field, orderBy.direction);
      }
      
      if (startAfter) {
        query = query.startAfter(startAfter);
      }
      
      const snapshot = await query.limit(limit).get();
      const documents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      
      return { success: true, data: { documents, lastDoc } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Upload de imágenes optimizado
  async uploadImage(uri: string, path: string, onProgress?: (progress: number) => void): Promise<FirebaseResponse<string>> {
    try {
      const reference = storage().ref(path);
      const task = reference.putFile(uri);
      
      if (onProgress) {
        task.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        });
      }
      
      await task;
      const downloadURL = await reference.getDownloadURL();
      
      return { success: true, data: downloadURL };
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
    };
    return errorMessages[errorCode] || 'Error de autenticación';
  }
}

export const firebaseService = new FirebaseService();
export { auth, firestore, storage };

