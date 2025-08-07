import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ClientStackParamList } from './types';
import { ClientBottomTabs } from './ClientBottomTabNavigator';
import ClientProfile from '../screens/ClientScreens/ClientProfileScreen';

//pantallas de cliente sin tabs
//import ClientHome from '../screens/Client/ClientHome';
//import ClientProfile from '../screens/Client/ClientProfile';
//import ClientSettings from '../screens/Client/ClientSettings';
//import ClientMessages from '../screens/Client/ClientMessages';
//import ClientNotifications from '../screens/Client/ClientNotifications';
//import ClientOrders from '../screens/Client/ClientOrders';

const Stack = createNativeStackNavigator<ClientStackParamList>();

export const ClientStackNavigator : React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* tab navigator como pantalla principal */}
            <Stack.Screen name="ClientMain" component={ ClientBottomTabs } />
            {/*<Stack.Screen name="ClientProfile" component={ClientProfile} />*/}

            {/* Pantallas de cliente con tabs */}
            <Stack.Screen name="ClientProfile" component={ ClientProfile } 
            options={{ headerShown: true, title: 'Perfil', presentation: 'modal' }}/>
        </Stack.Navigator>
    );
};
