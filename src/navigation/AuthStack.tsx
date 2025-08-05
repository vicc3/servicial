import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import AuthStack from './AuthStack';
import auth from '@react-native-firebase/auth';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

//navegacion de la app
import { ClientStackNavigator } from './ClientStackNavigator';
import { WorkerStackNavigator } from './WorkerStackNavigator';
import { firestore } from '../config/firebase';
import { AuthStackParamList } from './types';

interface userData {
  role: 'user' | 'worker';
  nombre: string;
}

const RootStack = createNativeStackNavigator<AuthStackParamList>();

export default function Navigation() {
  const theme = useTheme();
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [role, setRole] = useState<'user' | 'worker' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDoc = await firestore()
          .collection('users')
          .doc(firebaseUser.uid)
          .get();

          if (userDoc.exists()) {
            const userData = userDoc.data() as userData;
            setRole(userData.role || 'user');
          } else {
            setRole('user'); //por defecto
          }
        } catch (error) {
        console.error('Error fetching user role: ', error)
        setRole('user');
      } 
    } else {
      setRole(null);
    } setLoading(false);
});
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary}/>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        { user ? (
          //usuariuoa autenticado - navegar segun rol
          role == 'worker' ? (
            <RootStack.Screen name="WorkerApp" component={WorkerStackNavigator}/>
          ) : (
            <RootStack.Screen name="ClientApp" component={ClientStackNavigator}/>
          )
        ) : (
          // usuario no autenticado
          <RootStack.Screen name="Auth" component={AuthStack}/>
        )}
        </RootStack.Navigator>
    </NavigationContainer>
  );
}