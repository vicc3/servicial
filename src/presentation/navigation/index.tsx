import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import auth from '@react-native-firebase/auth';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

export default function Navigation() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(u => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null; // o un splash screen

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
