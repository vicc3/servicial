//Pantalla de inicio para trabajadores
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WorkerStackParamList } from '../../navigation/types';
import { useTheme, Title, Text, Card, Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<WorkerStackParamList, 'WorkerHome'>;

const WorkerHomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  const stats = [
    { title: 'Trabajos Completados', value: '24', icon: 'check-circle', color: '#4CAF50' },
    { title: 'Calificación', value: '4.8', icon: 'star', color: '#FFD700' },
    { title: 'Ganancias del Mes', value: '$12,500', icon: 'cash', color: '#2196F3' },
    { title: 'Trabajos Pendientes', value: '3', icon: 'clock', color: '#FF9800' },
  ];

  const recentJobs = [
    {
      id: '1',
      title: 'Reparación Eléctrica',
      client: 'Ana García',
      status: 'En progreso',
      date: 'Hoy, 2:00 PM',
      payment: '$800',
    },
    {
      id: '2',
      title: 'Instalación de Luces',
      client: 'Carlos Ruiz',
      status: 'Completado',
      date: 'Ayer, 10:00 AM',
      payment: '$1,200',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Title style={styles.welcomeTitle}>¡Buen día! 👋</Title>
          <Text style={styles.welcomeSubtitle}>Tienes 3 trabajos pendientes</Text>
        </View>
        
        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                  <Icon name={stat.icon} size={24} color={stat.color} />
                </View>
                <View style={styles.statInfo}>
                  <Title style={styles.statValue}>{stat.value}</Title>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Trabajos recientes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Trabajos Recientes</Title>
            <Button onPress={() => navigation.navigate('WorkerBookings')}>
              Ver todos
            </Button>
          </View>
          
          {recentJobs.map((job) => (
            <Card 
              key={job.id} 
              style={styles.jobCard}
              onPress={() => navigation.navigate('JobDetails', { jobId: job.id })}
            >
              <Card.Content>
                <View style={styles.jobHeader}>
                  <Title style={styles.jobTitle}>{job.title}</Title>
                  <Text style={[
                    styles.jobStatus,
                    { color: job.status === 'Completado' ? '#4CAF50' : '#FF9800' }
                  ]}>
                    {job.status}
                  </Text>
                </View>
                <Text style={styles.jobClient}>Cliente: {job.client}</Text>
                <View style={styles.jobFooter}>
                  <Text style={styles.jobDate}>{job.date}</Text>
                  <Text style={styles.jobPayment}>{job.payment}</Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 25,
    marginTop: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    width: '48%',
    marginBottom: 15,
    elevation: 2,
    borderRadius: 12,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent