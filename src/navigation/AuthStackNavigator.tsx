import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importar pantallas de forma segura
import LoginScreen from '../screens/common/LoginScreen';
import RegisterMenuScreen from '../screens/common/RegisterMenuScreen';
import RegistrationScreen from '../screens/common/RegisterScreen';

export type AuthStackParamList = {
  Login: undefined;
  RegisterMenu: undefined;
  RegistrationScreen: { role: 'user' | 'worker' };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStackNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterMenu" component={RegisterMenuScreen} />
      <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
    </Stack.Navigator>
  );
}