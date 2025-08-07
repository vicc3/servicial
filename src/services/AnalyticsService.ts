// src/services/AnalyticsService.ts
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

interface AnalyticsEvent {
  name: string;
  parameters?: { [key: string]: any };
}

interface UserProperties {
  user_type: 'client' | 'worker';
  app_version: string;
  device_type: string;
}

class AnalyticsService {
  async initialize() {
    try {
      await analytics().setAnalyticsCollectionEnabled(true);
      console.log('Analytics initialized');
    } catch (error) {
      console.error('Error initializing analytics:', error);
    }
  }

  async logEvent(event: AnalyticsEvent) {
    try {
      await analytics().logEvent(event.name, event.parameters);
    } catch (error) {
      console.error('Error logging event:', error);
    }
  }

  async setUserProperties(properties: Partial<UserProperties>) {
    try {
      for (const [key, value] of Object.entries(properties)) {
        await analytics().setUserProperty(key, String(value));
      }
    } catch (error) {
      console.error('Error setting user properties:', error);
    }
  }

  async setUserId(userId: string) {
    try {
      await analytics().setUserId(userId);
      await crashlytics().setUserId(userId);
    } catch (error) {
      console.error('Error setting user ID:', error);
    }
  }

  // Eventos específicos de la app
  async logLogin(method: string) {
    await this.logEvent({
      name: 'login',
      parameters: { method }
    });
  }

  async logSignUp(method: string, userType: string) {
    await this.logEvent({
      name: 'sign_up',
      parameters: { method, user_type: userType }
    });
  }

  async logServiceRequest(serviceType: string, amount: number) {
    await this.logEvent({
      name: 'service_request',
      parameters: { 
        service_type: serviceType,
        value: amount,
        currency: 'MXN'
      }
    });
  }

  async logBookingComplete(serviceType: string, amount: number) {
    await this.logEvent({
      name: 'purchase',
      parameters: {
        service_type: serviceType,
        value: amount,
        currency: 'MXN'
      }
    });
  }
}
export const analyticsService = new AnalyticsService();

{/*}

  async logCustomError(message: string, stack?: string) {
    try {
      await crashlytics().log(message);
      if (stack) {
        await crashlytics().recordError(new Error(message));
      }
    } catch (error) {
      console.error('Error logging custom error:', error);
  }
  */}


