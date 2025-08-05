import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator, Image, TouchableOpacity, Switch } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Appbar, useTheme, Title, Text, Card, Button, IconButton } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomNavigationBar from '../navigation/BottomNavigationBar';

// Definimos el tipo de props para la pantalla ProfileWorkerScreen
type Props = NativeStackScreenProps<RootStackParamList, 'WorkerProfile'>;

interface UserData {
  nombreCompleto: string;
  correoElectronico: string;
  telefono: string;
  ciudadRegion: string;
  role: 'user' | 'worker'; // Asumimos que el usuario tiene un rol
  services?: string[]; // Para los servicios que ofrece un trabajador
}

const ProfileWorkerScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Efecto para obtener la información del usuario al cargar la pantalla
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
          if (userDoc.exists()) { // <-- CORRECCIÓN: Llamar a la función exists()
            setUserData(userDoc.data() as UserData);
          } else {
            console.log("No se encontraron datos de usuario en Firestore.");
          }
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        Alert.alert('Error', 'No se pudieron cargar los datos del perfil.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente.');
      navigation.navigate('Login'); // Redirige al usuario a la pantalla de Login
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert('Error', 'No se pudo cerrar la sesión.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.fullScreenContainer, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const toggleSwitch = () => setNotificationsEnabled(previousState => !previousState);

  return (
    <View style={styles.fullScreenContainer}>
      <Appbar.Header style={{ backgroundColor: 'transparent', elevation: 0 }}>
        <Appbar.Content title="Perfil Trabajador" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {userData ? (
          <>
            {/* Sección de perfil principal */}
            <View style={styles.profileHeader}>
              <Image
                source={{ uri: 'https://placehold.co/80x80/cccccc/333333?text=JS' }}
                style={styles.profileImage}
              />
              <View style={styles.profileTextContainer}>
                <Title style={styles.profileName}>{userData.nombreCompleto}</Title>
                <Text style={styles.profileRole}>
                  {userData.role === 'worker' ? 'Electricista' : 'Cliente'}
                </Text>
              </View>
            </View>

            {/* Sección de "Tus Servicios" */}
            <Title style={styles.sectionTitle}>Tus Servicios</Title>
            <View style={styles.servicesContainer}>
              {['Eléctrico', 'Fontanería', 'Carpintería', 'Limpieza'].map((service, index) => (
                <TouchableOpacity key={index} style={[styles.serviceCard, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <Icon name="tools" size={24} color={theme.colors.primary} />
                  <Text style={[styles.serviceText, { color: theme.colors.primary }]}>{service}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              mode="contained"
              onPress={() => console.log('Agregar Servicio')}
              style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
              labelStyle={styles.buttonLabel}
            >
              Agregar Servicio
            </Button>

            {/* Sección de "Información de Contacto" */}
            <Title style={styles.sectionTitle}>Información de Contacto</Title>
            <View style={styles.contactContainer}>
              <Text style={styles.contactLabel}>Teléfono</Text>
              <Text style={styles.contactValue}>{userData.telefono || '+1 234 567 890'}</Text>

              <Text style={styles.contactLabel}>Correo</Text>
              <Text style={styles.contactValue}>{userData.correoElectronico}</Text>
            </View>

            {/* Sección de Notificaciones */}
            <View style={styles.notificationContainer}>
              <Text style={styles.notificationText}>Recibir notificaciones</Text>
              <Switch
                trackColor={{ false: theme.colors.onSurfaceVariant, true: theme.colors.primary }}
                thumbColor={notificationsEnabled ? theme.colors.primary : theme.colors.onSurface}
                onValueChange={toggleSwitch}
                value={notificationsEnabled}
              />
            </View>
            
            <Button
              mode="contained"
              onPress={handleLogout}
              style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
              labelStyle={styles.buttonLabel}
            >
              Cerrar Sesión
            </Button>
          </>
        ) : (
          <View style={styles.centered}>
            <Text style={styles.noDataText}>No se encontraron datos del perfil.</Text>
            <Button
              mode="contained"
              onPress={handleLogout}
              style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
              labelStyle={styles.buttonLabel}
            >
              Cerrar Sesión
            </Button>
          </View>
        )}
      </ScrollView>

      {/* Barra de navegación inferior */}
      <BottomNavigationBar currentScreen="WorkerProfile" />
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 80,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileTextContainer: {
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileRole: {
    fontSize: 16,
    color: '#888',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  serviceCard: {
    width: '48%',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 1,
  },
  serviceText: {
    marginTop: 5,
    fontWeight: '600',
  },
  addButton: {
    width: '100%',
    borderRadius: 10,
    paddingVertical: 5,
    marginBottom: 20,
  },
  contactContainer: {
    marginBottom: 20,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 10,
  },
  contactValue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  notificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 20,
  },
  notificationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    width: '100%',
    marginTop: 20,
    borderRadius: 10,
    paddingVertical: 5,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  noDataText: {
    fontSize: 18,
    color: '#888',
    marginBottom: 20,
    textAlign: 'center',
  },

});

export default ProfileWorkerScreen;