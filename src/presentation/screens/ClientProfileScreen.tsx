import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator, Image, TouchableOpacity, Switch, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Appbar, useTheme, Title, Text, Card, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

type Props = NativeStackScreenProps<RootStackParamList, 'ClientProfile'>;

interface UserData {
  nombreCompleto: string;
  correoElectronico: string;
  telefono: string;
  ciudadRegion: string;
  role: 'user' | 'worker';
}

const { width } = Dimensions.get('window');

const ClientProfileScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const serviceHistory = [
    {
      title: 'Reparación de Plomería',
      date: 'Completado el 10/10/2023',
      image: 'https://placehold.co/200x100/cccccc/333333?text=Plomeria',
    },
    {
      title: 'Instalación Eléctrica',
      date: 'Completado el 05/09/2023',
      image: 'https://placehold.co/200x100/999999/ffffff?text=Electricidad',
    },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
          if (userDoc.exists()) {
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
      navigation.navigate('Login');
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
  
  const clientSince = '2025';

  return (
    <View style={styles.fullScreenContainer}>
      <Appbar.Header style={{ backgroundColor: 'transparent', elevation: 0 }}>
        {<Appbar.Content title="Perfil Cliente" />}
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {userData ? (
          <>
            {/* Sección de perfil principal */}
            <View style={styles.profileHeader}>
              <Image
                source={{ uri: '' }}
                style={styles.profileImage}
              />
              <View style={styles.profileTextContainer}>
                <Title style={styles.profileName}>{userData.nombreCompleto}</Title>
                <Text style={styles.profileSubtitle}>Cliente desde {clientSince}</Text>
              </View>
            </View>

            {/* Sección de "Información Personal" */}
            <Title style={styles.sectionTitle}>Información Personal</Title>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Correo Electrónico</Text>
              <Text style={styles.infoValue}>{userData.correoElectronico}</Text>

              <Text style={styles.infoLabel}>Teléfono</Text>
              <Text style={styles.infoValue}>{userData.telefono}</Text>
            </View>

            {/* Sección de "Preferencias" */}
            <Title style={styles.sectionTitle}>Preferencias</Title>
            <View style={styles.notificationContainer}>
              <Text style={styles.notificationText}>Recibir notificaciones</Text>
              <Switch
                trackColor={{ false: '#767577', true: theme.colors.primary }}
                thumbColor={notificationsEnabled ? theme.colors.primary : '#f4f3f4'}
                onValueChange={toggleSwitch}
                value={notificationsEnabled}
              />
            </View>

            {/* Sección de "Historial de Servicios" */}
            <Title style={styles.sectionTitle}>Historial de Servicios</Title>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyCarousel}>
              {serviceHistory.map((service, index) => (
                <Card key={index} style={styles.serviceCard}>
                  <Card.Cover source={{ uri: service.image }} style={styles.serviceImage} />
                  <Card.Content>
                    <Title style={styles.serviceTitle}>{service.title}</Title>
                    <Text style={styles.serviceDate}>{service.date}</Text>
                  </Card.Content>
                </Card>
              ))}
            </ScrollView>

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
      <Appbar style={styles.bottomNavigation}>
        <Appbar.Action
          icon="home"
          onPress={() => navigation.navigate('Home')}
          color={theme.colors.onSurface}
        />
        <Appbar.Action
          icon="account"
          onPress={() => navigation.navigate('ClientProfile')}
          color={theme.colors.primary}
        />
      </Appbar>
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
    marginBottom: 5,
    marginTop: 5,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileTextContainer: {
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 10,
  },
  infoValue: {
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
  historyCarousel: {
    marginBottom: 20,
  },
  serviceCard: {
    width: width * 0.5,
    marginRight: 15,
    borderRadius: 10,
  },
  serviceImage: {
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  serviceDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  noDataText: {
    fontSize: 18,
    color: '#888',
    marginBottom: 20,
    textAlign: 'center',
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
  bottomNavigation: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    elevation: 4,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default ClientProfileScreen;