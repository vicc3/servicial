import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useUserRole } from '../hooks/useUserRole';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ClientStackParamList } from './types';

//pantallas de cliente
//import ClientHome from '../screens/Client/ClientHome';
import ClientProfile from '../screens/ClientScreens/ClientProfileScreen';
import ClienMain from '../screens/ClientScreens/ClientHomeScreen';
import ClientHomeScreen from '../screens/ClientScreens/ClientHomeScreen';
//import ClientSettings from '../screens/Client/ClientSettings';
//import ClientMessages from '../screens/Client/ClientMessages';
//import ClientNotifications from '../screens/Client/ClientNotifications';
//import ClientOrders from '../screens/Client/ClientOrders';
//import ClientOrderDetails from '../screens/Client/ClientOrderDetails';

const Tab = createBottomTabNavigator<ClientStackParamList>();

export const ClientBottomTabs : React.FC = () => {
    const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions = {({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;
          
          switch (route.name) {
            case 'ClientMain':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'ClientProfile':
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
      <Tab.Screen name="ClientMain" component={ClientHomeScreen} />
      <Tab.Screen name="ClientProfile" component={ClientProfile} />
    </Tab.Navigator>
  );
};

export default ClientBottomTabs;