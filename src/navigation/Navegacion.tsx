import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Navegación
import AuthStackNavigator from './AuthStackNavigator';
import { ClientStackNavigator } from './ClientStackNavigator';
import { WorkerStackNavigator } from './WorkerStackNavigator';

interface UserData {
  role: 'user' | 'worker';
  nombre: string;
}

const RootStack = createNativeStackNavigator();

// Error Boundary Component mejorado
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Navigation Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Algo salió mal</Text>
          <Text style={styles.errorMessage}>
            {this.state.error?.message || 'Error desconocido'}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function Navigation() {
  const theme = useTheme();
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [role, setRole] = useState<'user' | 'worker' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        console.log('🔍 Navigation: Inicializando autenticación...');
        // Verificar si Firebase está disponible
        if (!auth) {
          console.error('❌ Navigation: Firebase Auth no está disponible');
          setError('Error de configuración de Firebase');
          setLoading(false);
          return;
        }

        unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
          try {
            console.log('🔄 Navigation: Auth state changed:', firebaseUser ? `User logged in (${firebaseUser.uid})` : 'No user');
            setUser(firebaseUser);
            
            if (firebaseUser) {
              // Verificar el rol del usuario en Firestore
              try {
                console.log('🔍 Navigation: Verificando rol del usuario:', firebaseUser.uid);
                const userDoc = await firestore()
                  .collection('users')
                  .doc(firebaseUser.uid)
                  .get();

                if (userDoc.exists()) {
                  const userData = userDoc.data() as UserData;
                  console.log('✅ Navigation: Rol encontrado:', userData.role);
                  console.log('📋 Navigation: Datos completos del usuario:', userData);
                  setRole(userData.role || 'user');
                } else {
                  console.log('⚠️ Navigation: Usuario no encontrado en Firestore, usando rol por defecto');
                  setRole('user'); // Rol por defecto
                }
              } catch (firestoreError) {
                console.error('❌ Navigation: Error obteniendo rol del usuario:', firestoreError);
                setRole('user'); // Fallback a rol por defecto
              }
            } else {
              console.log('🚪 Navigation: No hay usuario autenticado');
              setRole(null);
            }
          } catch (authError) {
            console.error('❌ Navigation: Auth state change error:', authError);
            setError('Error de autenticación');
          } finally {
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('❌ Navigation: Error initializing auth:', error);
        setError('Error al inicializar la aplicación');
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error de Conexión</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  console.log('🎯 Navigation: Estado actual - Usuario:', user?.uid, 'Rol:', role);
  console.log('🎯 Navigation: Decisión de navegación:', role === 'worker' ? 'WorkerApp' : 'ClientApp');

  return (
    <ErrorBoundary>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Usuario autenticado - navegar según rol
          role === 'worker' ? (
            <RootStack.Screen name="WorkerApp" component={WorkerStackNavigator} />
          ) : (
            <RootStack.Screen name="ClientApp" component={ClientStackNavigator} />
          )
        ) : (
          // Usuario no autenticado
          <RootStack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </RootStack.Navigator>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#d32f2f',
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});