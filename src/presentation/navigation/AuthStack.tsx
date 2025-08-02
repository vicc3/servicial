import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

// Importa todas las pantallas con la nomenclatura correcta
import LoginScreen from '../screens/LoginScreen';
import RegisterMenuScreen from '../screens/RegisterMenuScreen';
import HomeScreen from '../screens/HomeScreen'; // Nombre de archivo corregido
import ClientProfileScreen from '../screens/ClientProfileScreen';
import WorkerProfileScreen from '../screens/WorkerProfileScreen'; // Nombre de archivo corregido
import ProfileLoader from '../screens/ProfileLoader'; // Importa el nuevo componente ProfileLoader

// Importa el nuevo componente ProfileLoader
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      {/* Pantallas de autenticación */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterMenu" component={RegisterMenuScreen} />
      {/* Pantallas principales de la aplicación */}
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* La pantalla de perfil ahora es un loader que redirige al perfil correcto */}
      <Stack.Screen name="Profile" component={ ProfileLoader } />
      {/* Las pantallas de perfil reales también deben estar en el navegador */}
      <Stack.Screen name="ClientProfile" component={ClientProfileScreen} />
      <Stack.Screen name="WorkerProfile" component={WorkerProfileScreen} />
    </Stack.Navigator>
  );
}
