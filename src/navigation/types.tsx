import RegistrationScreen from '../screens/common/RegisterScreen';

// navigation
export type AuthStackParamList = {
  Login: undefined;
  RegisterMenu: undefined;
  RegistrationScreen: { role: 'user' | 'worker' };
  Auth: undefined;
  ClientApp: undefined;
  WorkerApp: undefined;
};

export type ClientStackParamList = {
  ClientMain: undefined;
  ClientProfile: undefined;
  ClientSettings: undefined;
  ClientMessages: undefined;
  ClientNotifications: undefined;
  ClientOrders: undefined;
  ClientOrderDetails: undefined;
  ClientOrderTracking: undefined;
};

export type WorkerStackParamList = {
  WorkerMain: undefined;
  WorkerProfile: undefined;
  WorkerSettings: undefined;
  WorkerMessages: undefined;
  WorkerNotifications: undefined;
  WorkerOrders: undefined;
  WorkerOrderDetails: undefined;
  WorkerOrderTracking: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  ClientApp: undefined;
  WorkerApp: undefined;
  RegisterMenu: undefined;
  RegistrationScreen: { role: 'user' | 'worker' };
  Login: undefined;
};
