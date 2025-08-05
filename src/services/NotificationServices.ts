// src/services/NotificationService.ts
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import { firebaseService, firestore } from '../config/firebase';
import { auth } from '../config/firebase';


export interface NotificationData {
  title: string;
  body: string;
  data?: { [key: string]: string };
  userId: string;
  type: 'booking' | 'message' | 'review' | 'payment' | 'general';
}

class NotificationService {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      // Solicitar permisos
      const authStatus = await messaging().requestPermission();
      const enabled = 
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('Notification permission denied');
        return;
      }

      // Obtener token FCM
      const token = await messaging().getToken();
      console.log('FCM Token:', token);

      // Guardar token en Firestore
      await this.saveTokenToDatabase(token);

      // Configurar listeners
      this.setupMessageHandlers();
      this.setupTokenRefreshHandler();

      this.initialized = true;
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  private async saveTokenToDatabase(token: string) {
    const user = auth().currentUser;
    if (user) {
      await firebaseService.updateDocument('users', user.uid, {
        fcmToken: token,
        platform: Platform.OS,
        lastTokenUpdate: firestore.FieldValue.serverTimestamp(),
      });
    }
  }

  private setupMessageHandlers() {
    // Mensaje recibido cuando la app está en primer plano
    messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message:', remoteMessage);
      this.handleForegroundMessage(remoteMessage);
    });

    // Mensaje que abrió la app desde estado cerrado
    messaging().getInitialNotification().then((remoteMessage) => {
      if (remoteMessage) {
        console.log('App opened from notification:', remoteMessage);
        this.handleNotificationOpen(remoteMessage);
      }
    });

    // Mensaje que abrió la app desde background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('App opened from background notification:', remoteMessage);
      this.handleNotificationOpen(remoteMessage);
    });
  }

  private setupTokenRefreshHandler() {
    messaging().onTokenRefresh(async (token) => {
      console.log('FCM Token refreshed:', token);
      await this.saveTokenToDatabase(token);
    });
  }

  private handleForegroundMessage(message: FirebaseMessagingTypes.RemoteMessage) {
    const { notification, data } = message;
    
    Alert.alert(
      notification?.title || 'Nueva notificación',
      notification?.body || '',
      [
        { text: 'Cerrar', style: 'cancel' },
        { 
          text: 'Ver', 
          onPress: () => this.handleNotificationAction(data)
        }
      ]
    );
  }

  private handleNotificationOpen(message: FirebaseMessagingTypes.RemoteMessage) {
    const { data } = message;
    this.handleNotificationAction(data);
  }

  private handleNotificationAction(data?: { [key: string]: string | object }) {
    if (!data) return;

    // Navegar según el tipo de notificación
    switch (data.type as string) {
      case 'booking':
        // NavigationService.navigate('BookingDetails', { bookingId: data.bookingId });
        break;
      case 'message':
        // NavigationService.navigate('Chat', { chatId: data.chatId });
        break;
      case 'review':
        // NavigationService.navigate('Reviews');
        break;
      default:
        console.log('Unknown notification type:', data.type);
    }
  }

  // Función para enviar notificación (llamar desde Cloud Functions)
  static async sendNotification(notificationData: NotificationData) {
    // Esta función se llamaría desde Cloud Functions de Firebase
    // Aquí solo como referencia de la estructura de datos
    const payload = {
      notification: {
        title: notificationData.title,
        body: notificationData.body,
      },
      data: {
        type: notificationData.type,
        ...notificationData.data,
      },
      topic: `user_${notificationData.userId}`,
    };
    
    return payload;
  }
}

export const notificationService = new NotificationService();