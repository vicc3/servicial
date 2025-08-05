// src/hooks/useImagePicker.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import { firebaseService } from '../../config/firebase';

export function useImagePicker() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const showImagePicker = (): Promise<string | null> => {
    return new Promise((resolve) => {
      Alert.alert(
        'Seleccionar imagen',
        'Elige una opción',
        [
          { text: 'Cancelar', style: 'cancel', onPress: () => resolve(null) },
          { text: 'Cámara', onPress: () => openCamera(resolve) },
          { text: 'Galería', onPress: () => openGallery(resolve) },
        ]
      );
    });
  };

  const openCamera = (resolve: (value: string | null) => void) => {
    launchCamera({ mediaType: 'photo', quality: 0.7 }, (response) => {
      handleImageResponse(response, resolve);
    });
  };

  const openGallery = (resolve: (value: string | null) => void) => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
      handleImageResponse(response, resolve);
    });
  };

  const handleImageResponse = (response: ImagePickerResponse, resolve: (value: string | null) => void) => {
    if (response.didCancel || response.errorMessage || !response.assets?.[0]) {
      resolve(null);
      return;
    }

    const asset = response.assets[0];
    if (asset.uri) {
      resolve(asset.uri);
    } else {
      resolve(null);
    }
  };

  const uploadImage = async (uri: string, folder: string, fileName?: string): Promise<string | null> => {
    setUploading(true);
    setUploadProgress(0);

    const timestamp = Date.now();
    const finalFileName = fileName || `image_${timestamp}.jpg`;
    const path = `${folder}/${finalFileName}`;

    const result = await firebaseService.uploadImage(uri, path, setUploadProgress);
    
    setUploading(false);
    setUploadProgress(0);

    if (result.success) {
      return result.data || null;
    } else {
      Alert.alert('Error', result.error || 'Error al subir imagen');
      return null;
    }
  };

  return {
    showImagePicker,
    uploadImage,
    uploading,
    uploadProgress,
  };
}