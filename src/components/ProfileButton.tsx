import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useUserRole } from '../hooks/useUserRole';

interface ProfileButtonProps {
  size?: number;
  iconColor?: string;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ 
  size = 24, 
  iconColor 
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { userRole, loading } = useUserRole();

  const handleProfilePress = () => {
    if (loading) return; // No hacer nada si aún está cargando
    
    // Navegar directamente a la pantalla correcta basada en el rol
    if (userRole === 'user') {
      navigation.navigate('ClientProfile' as never);
    } else if (userRole === 'worker') {
      navigation.navigate('WorkerProfile' as never);
    } else {
      // Si no hay rol definido, usar el ProfileLoader como fallback
      navigation.navigate('Profile' as never);
    }
  };

  return (
    <TouchableOpacity onPress={handleProfilePress} disabled={loading}>
      <IconButton
        icon="account-outline"
        size={size}
        iconColor={iconColor || theme.colors.onSurface}
        disabled={loading}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Estilos si son necesarios
});

export default ProfileButton; 