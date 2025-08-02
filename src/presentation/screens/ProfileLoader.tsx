import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from 'react-native-paper';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileLoader: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'user' | 'worker' | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
          if (userDoc.exists()) {
            const role = userDoc.data()?.role;
            if (role === 'user' || role === 'worker') {
              setUserRole(role);
            }
          }
        }
      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (userRole === 'user') {
        navigation.replace('ClientProfile');
      } else if (userRole === 'worker') {
        navigation.replace('WorkerProfile');
      } else {
        navigation.replace('Login');
      }
    }
  }, [loading, userRole, navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return null; // Nunca se llega aquí porque navigation.replace redirige
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default ProfileLoader;