// src/services/PermissionService.ts
import { Platform, Alert, Linking } from 'react-native';
import { 
  PERMISSIONS, 
  RESULTS, 
  request, 
  check, 
  openSettings,
  requestMultiple
} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';

type PermissionType = 'camera' | 'photo' | 'location' | 'notification' | 'microphone';

class PermissionService {
  private getPermission(type: PermissionType) {
    const permissions = {
      camera: Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.CAMERA 
        : PERMISSIONS.ANDROID.CAMERA,
      photo: Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      location: Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      notification: Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA // Fallback since NOTIFICATIONS doesn't exist
        : PERMISSIONS.ANDROID.CAMERA, // Fallback since POST_NOTIFICATION doesn't exist
      microphone: Platform.OS === 'ios'
        ? PERMISSIONS.IOS.MICROPHONE
        : PERMISSIONS.ANDROID.RECORD_AUDIO,
    };

    return permissions[type];
  }

  async checkPermission(type: PermissionType): Promise<boolean> {
    try {
      const permission = this.getPermission(type);
      const result = await check(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error(`Error checking ${type} permission:`, error);
      return false;
    }
  }

  async requestPermission(type: PermissionType): Promise<boolean> {
    try {
      const permission = this.getPermission(type);
      const result = await request(permission);
      
      if (result === RESULTS.GRANTED) {
        return true;
      } else if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
        this.showPermissionAlert(type);
        return false;
      }
      
      return false;
    } catch (error) {
      console.error(`Error requesting ${type} permission:`, error);
      return false;
    }
  }

  async requestMultiplePermissions(types: PermissionType[]): Promise<{[key: string]: boolean}> {
    try {
      const permissions = types.reduce((acc, type) => {
        acc[type] = this.getPermission(type);
        return acc;
      }, {} as {[key: string]: any});

      const results = await requestMultiple(Object.values(permissions));
      
      return types.reduce((acc, type) => {
        const permission = this.getPermission(type);
        acc[type] = results[permission] === RESULTS.GRANTED;
        return acc;
      }, {} as {[key: string]: boolean});
    } catch (error) {
      console.error('Error requesting multiple permissions:', error);
      return types.reduce((acc, type) => {
        acc[type] = false;
        return acc;
      }, {} as {[key: string]: boolean});
    }
  }

  private showPermissionAlert(type: PermissionType) {
    const messages = {
      camera: 'Necesitamos acceso a la cámara para tomar fotos',
      photo: 'Necesitamos acceso a las fotos para seleccionar imágenes',
      location: 'Necesitamos acceso a la ubicación para mostrarte servicios cercanos',
      notification: 'Necesitamos permisos de notificación para mantenerte informado',
      microphone: 'Necesitamos acceso al micrófono para llamadas de voz',
    };

    Alert.alert(
      'Permiso requerido',
      `${messages[type]}. Ve a Configuración para habilitarlo.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Configuración', onPress: () => openSettings() },
      ]
    );
  }

  // Métodos específicos con manejo de errores
  async getCurrentLocation(): Promise<{latitude: number; longitude: number} | null> {
    const hasPermission = await this.requestPermission('location');
    if (!hasPermission) return null;

    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    });
  }
}

export const permissionService = new PermissionService();