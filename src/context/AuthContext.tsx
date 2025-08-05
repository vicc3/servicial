import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { User } from '../types/User';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseAuthTypes.User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Obtener datos adicionales del usuario desde Firestore
          const userDoc = await firestore()
            .collection('users')
            .doc(firebaseUser.uid)
            .get();

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              nombreCompleto: userData?.nombreCompleto || '',
              email: userData?.correoElectronico || firebaseUser.email || '',
              telefono: userData?.telefono || '',
              ciudadRegion: userData?.ciudadRegion || '',
              role: userData?.role || 'user',
              createdAt: userData?.createdAt,
            });
          } else {
            // Usuario no existe en Firestore, crear registro básico
            const newUser: User = {
              uid: firebaseUser.uid,
              nombreCompleto: firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              telefono: '',
              ciudadRegion: '',
              role: 'user', // Valor por defecto
              createdAt: firestore.FieldValue.serverTimestamp(),
            };
            
            await firestore()
              .collection('users')
              .doc(firebaseUser.uid)
              .set(newUser);
            
            setUser(newUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};