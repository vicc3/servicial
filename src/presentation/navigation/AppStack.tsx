import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
     
    

    </Stack.Navigator>
  );
}

