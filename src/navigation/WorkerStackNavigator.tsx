import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WorkerStackParamList } from './types';
import { WorkerBottomTabs } from './WorkerBottomTabNavigator';

//pantallas de trabajador sin tabs
//import WorkerHome from '../screens/Worker/WorkerHome';
import WorkerProfile from '../screens/WorkerScreens/WorkerProfileScreen';
//import WorkerSettings from '../screens/Worker/WorkerSettings';
//import WorkerMessages from '../screens/Worker/WorkerMessages';
//import WorkerNotifications from '../screens/Worker/WorkerNotifications';
//import WorkerOrders from '../screens/Worker/WorkerOrders';
//import WorkerOrderDetails from '../screens/Worker/WorkerOrderDetails';

const Stack = createNativeStackNavigator<WorkerStackParamList>();   

export const WorkerStackNavigator : React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* tab navigator como pantalla principal */}
            <Stack.Screen name="WorkerHome" component={ WorkerBottomTabs } />
            {/* Pantallas de trabajador con tabs */}
            <Stack.Screen name="WorkerProfile" component={ WorkerProfile } 
            options={{ headerShown: true, title: 'Perfil', presentation: 'modal' }}/>
        </Stack.Navigator>
    );
};