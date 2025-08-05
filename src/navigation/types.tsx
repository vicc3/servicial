
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
  ClientHome: undefined;
  ClientProfile: undefined;
  ClientSettings: undefined;
  ClientMessages: undefined;
  ClientNotifications: undefined;
  ClientOrders: undefined;
  ClientOrderDetails: undefined;
  ClientOrderTracking: undefined;
};

export type WorkerStackParamList = {
  WorkerHome: undefined;
  WorkerProfile: undefined;
  WorkerSettings: undefined;
  WorkerMessages: undefined;
  WorkerNotifications: undefined;
  WorkerOrders: undefined;
  WorkerOrderDetails: undefined;
  WorkerOrderTracking: undefined;
};

export type RootStackParamList = AuthStackParamList & 
  ClientStackParamList &
  WorkerStackParamList;

