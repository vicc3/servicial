import React from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ClientStackParamList } from '../../navigation/types';
import { useTheme, Title, Paragraph, Card, IconButton, Text, Searchbar, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = BottomTabScreenProps<ClientStackParamList, 'ClientMain'>;

const { width } = Dimensions.get('window');

const ClientHomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');

  const categories = [
    { name: 'Electricidad', icon: 'lightning-bolt', color: '#FF6B35' },
    { name: 'Fontanería', icon: 'pipe-wrench', color: '#2196F3' },
    { name: 'Limpieza', icon: 'broom', color: '#4CAF50' },
    { name: 'Pintura', icon: 'palette', color: '#9C27B0' },
    { name: 'Jardinería', icon: 'flower', color: '#FF9800' },
    { name: 'Carpintería', icon: 'hammer', color: '#795548' },
  ];

  const featuredServices = [
    {
      id: '1',
      title: 'Electricista Certificado',
      provider: 'Juan Pérez',
      rating: 4.8,
      price: 'Desde $500/hr',
      image: 'https://placehold.co/300x200/2196F3/ffffff?text=Electricista',
    },
    {
      id: '2',
      title: 'Plomero de Emergencia',
      provider: 'María González',
      rating: 4.9,
      price: 'Desde $400/hr',
      image: 'https://placehold.co/300x200/FF6B35/ffffff?text=Plomero',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Title style={styles.welcomeTitle}>¡Hola! 👋</Title>
          <Text style={styles.welcomeSubtitle}>¿Qué servicio necesitas hoy?</Text>
        </View>

        {/* Barra de búsqueda */}
        <Searchbar
          placeholder="Buscar servicios..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          onSubmitEditing={() => navigation.navigate('ClientSearch')}
        />

        {/* Categorías */}
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Categorías</Title>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category, index) => (
              <View key={index} style={styles.categoryCard}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <Icon name={category.icon} size={28} color={category.color} />
                </View>
                <Text style={styles.categoryText}>{category.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Servicios destacados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Servicios Destacados</Title>
            <Button onPress={() => navigation.navigate('ClientServices')}>
              Ver todos
            </Button>
          </View>
          
          {featuredServices.map((service) => (
            <Card 
              key={service.id} 
              style={styles.serviceCard}
              onPress={() => navigation.navigate('ServiceDetails', { serviceId: service.id })}
            >
              <View style={styles.serviceCardContent}>
                <Image source={{ uri: service.image }} style={styles.serviceImage} />
                <View style={styles.serviceInfo}>
                  <Title style={styles.serviceTitle}>{service.title}</Title>
                  <Text style={styles.serviceProvider}>Por {service.provider}</Text>
                  <View style={styles.serviceFooter}>
                    <View style={styles.rating}>
                      <Icon name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>{service.rating}</Text>
                    </View>
                    <Text style={styles.servicePrice}>{service.price}</Text>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Acción rápida */}
        <Card style={styles.quickActionCard}>
          <Card.Content style={styles.quickActionContent}>
            <Icon name="lightning-bolt" size={32} color={theme.colors.primary} />
            <View style={styles.quickActionText}>
              <Title style={styles.quickActionTitle}>¿Necesitas ayuda urgente?</Title>
              <Text style={styles.quickActionSubtitle}>Encuentra servicios de emergencia</Text>
            </View>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('ClientSearch')}
              style={styles.quickActionButton}
            >
              Buscar
            </Button>
          </Card.Content>
        </Card>
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
    marginBottom: 20,
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
  searchBar: {
    marginBottom: 25,
    elevation: 2,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  categoriesContainer: {
    paddingRight: 20,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
  serviceCard: {
    marginBottom: 15,
    elevation: 2,
    borderRadius: 12,
  },
  serviceCardContent: {
    flexDirection: 'row',
    padding: 15,
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  serviceInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  serviceProvider: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  quickActionCard: {
    backgroundColor: '#e3f2fd',
    elevation: 2,
    borderRadius: 12,
  },
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  quickActionText: {
    flex: 1,
    marginLeft: 15,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  quickActionButton: {
    marginLeft: 15,
  },
});

export default ClientHomeScreen;