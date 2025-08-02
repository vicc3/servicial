import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC01gZedjJfptFUktz2PWvuSzrZIF99qbY",
  authDomain: "project00-d9baa.firebaseapp.com",
  projectId: "project00-d9baa",
  storageBucket: "project00-d9baa.firebasestorage.app",
  messagingSenderId: "112977220626",
  appId: "1:112977220626:android:553b18e4a47135cb4fb4cb"
};

import firebase from '@react-native-firebase/app';
if (firebase.app.name) {
  console.log('Firebase app already initialized', firebase.app.name);
} else {
  console.log('Initializing Firebase Error: Firebase app not initialized');
}


// Inicializar Firebase (opcional, ya que React Native Firebase se auto-inicializa)
// firebase.initializeApp(firebaseConfig);

// Exportar las instancias de Firebase
export { auth, firestore };

// Funciones de autenticación
export const signInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error };
  }
};

export const createUserWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error };
  }
};

export const signOut = async () => {
  try {
    await auth().signOut();
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

// Funciones de Firestore
export const addDocument = async (collection: string, data: any) => {
  try {
    const docRef = await firestore().collection(collection).add(data);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error };
  }
};

export const getDocument = async (collection: string, docId: string) => {
  try {
    const doc = await firestore().collection(collection).doc(docId).get();
    return { success: true, data: doc.data() };
  } catch (error) {
    return { success: false, error };
  }
};

export const updateDocument = async (collection: string, docId: string, data: any) => {
  try {
    await firestore().collection(collection).doc(docId).update(data);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const deleteDocument = async (collection: string, docId: string) => {
  try {
    await firestore().collection(collection).doc(docId).delete();
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const getCollection = async (collection: string) => {
  try {
    const snapshot = await firestore().collection(collection).get();
    const documents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, data: documents };
  } catch (error) {
    return { success: false, error };
  }
}; 