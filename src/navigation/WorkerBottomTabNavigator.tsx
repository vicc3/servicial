import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useUserRole } from '../hooks/useUserRole';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { WorkerStackParamList } from './types';

//pantallas de trabajador
//import WorkerHome from '../screens/Worker/WorkerHome';
import WorkerProfile from '../screens/WorkerScreens/WorkerProfileScreen';
//import WorkerSettings from '../screens/Worker/WorkerSettings';
//import WorkerMessages from '../screens/Worker/WorkerMessages';
//import WorkerNotifications from '../screens/Worker/WorkerNotifications';
//import WorkerOrders from '../screens/Worker/WorkerOrders';
//import WorkerOrderDetails from '../screens/Worker/WorkerOrderDetails';

const Tab = createBottomTabNavigator<WorkerStackParamList>();

export const WorkerBottomTabs : React.FC = () => {
    const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions = {({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;
          
          switch (route.name) {
            case 'WorkerHome':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'WorkerProfile':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'circle';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
        },
      })}
      >
      {/*<Tab.Screen name="WorkerHome" component={WorkerHome} />*/}
      <Tab.Screen name="WorkerProfile" component={WorkerProfile} />
    </Tab.Navigator>
  );
};
