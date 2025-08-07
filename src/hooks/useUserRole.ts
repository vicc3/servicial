import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export type UserRole = 'user' | 'worker' | null;

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      try {
        if (user) {
          console.log('useUserRole: Usuario autenticado, verificando rol...');
          const userDoc = await firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists()) {
            const role = userDoc.data()?.role;
            console.log('useUserRole: Rol encontrado:', role);
            if (role === 'user' || role === 'worker') {
              setUserRole(role);
            } else {
              setUserRole('user'); // Rol por defecto
            }
          } else {
            console.log('useUserRole: Usuario no encontrado en Firestore');
            setUserRole('user'); // Rol por defecto
          }
        } else {
          console.log('useUserRole: No hay usuario autenticado');
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
        setUserRole('user'); // Fallback
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return { userRole, loading };
}; 