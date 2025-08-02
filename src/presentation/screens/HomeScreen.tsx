import React from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Appbar, useTheme, Title, Paragraph, Card, IconButton, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Profile from './ProfileLoader';



// Definimos el tipo de props para la pantalla HomeScreen
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window'); // Obtenemos el ancho de la pantalla para el carrusel de tarjetas

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  const _handleProfile = (  ) => {
    navigation.navigate('Profile'); // This will work because navigation is passed from the stack
  };

  // Datos de ejemplo para las tarjetas de carrusel (Bienvenido)
  const welcomeCards = [
    {
      title: 'Electricista Experto',
      subtitle: 'Instalaciones y Reparaciones',
      image: 'https://placehold.co/400x200/cccccc/333333?text=Image+1',
    },
    {
      title: 'Plomero Profesional',
      image: 'https://placehold.co/400x200/999999/ffffff?text=Image+2',
    },
  ];

  const categories = [
    { name: 'Electricidad', icon: 'lightning-bolt' },
    { name: 'Fontanería', icon: 'pencil-box-multiple-outline' },
    { name: 'Limpieza', icon: 'broom' },
    { name: 'Pintura', icon: 'palette' },
    { name: 'Jardinería', icon: 'flower' },
  ];

  const recommendedServices = [
    {
      title: 'Electricista Experto',
      subtitle: 'Instalaciones y Reparaciones',
      image: 'https://placehold.co/60x60/cccccc/333333?text=Img',
    },
    {
      title: 'Plomero Profesional',
      subtitle: 'Servicios de Emergencia',
      image: 'https://placehold.co/60x60/999999/ffffff?text=Img',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        <Title style={styles.title}>Bienvenido</Title>

        {/* Carrusel de tarjetas de bienvenida */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.welcomeCarousel}
          contentContainerStyle={styles.welcomeCarouselContent}
        >
          {welcomeCards.map((card, index) => (
            <Card key={index} style={styles.welcomeCard}>
              <Card.Cover source={{ uri: card.image }} style={styles.cardImage} />
              <Card.Content style={styles.cardContent}>
                <Title>{card.title}</Title>
                <Paragraph style={styles.cardSubtitle}>{card.subtitle}</Paragraph>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        {/* Sección "Categorías" */}
        <Title style={styles.title}>Categorías</Title>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesSection}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <IconButton
                icon={() => <Icon name={category.icon} size={30} color={theme.colors.primary} />}
                onPress={() => console.log('Categoría:', category.name)}
                style={styles.categoryIcon}
              />
              <Text style={styles.categoryText}>{category.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Sección "Recomendado" */}
        <Title style={styles.title}>Recomendado</Title>
        <View style={styles.recommendedSection}>
          {recommendedServices.map((service, index) => (
            <Card key={index} style={styles.recommendedCard}>
              <View style={styles.recommendedCardContent}>
                <Image source={{ uri: service.image }} style={styles.recommendedImage} />
                <View style={styles.recommendedTextContent}>
                  <Title style={styles.recommendedTitle}>{service.title}</Title>
                  <Paragraph style={styles.recommendedSubtitle}>{service.subtitle}</Paragraph>
                </View>
              </View>
            </Card>
          ))}
        </View>

      </ScrollView>
      
      {/* Navegación inferior fija */}
      <Appbar style={styles.bottomNavigation}>
        <Appbar.Action
          icon="home"
          onPress={() => navigation.navigate('Home')}
          color={theme.colors.primary}
        />
        <Appbar.Action
          icon="account-outline"
          onPress={() => _handleProfile } // Redirige a la pantalla de perfil
          color={theme.colors.onSurface}
        />
      </Appbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 80, // Espacio para que la navegación inferior no tape el contenido
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 15,
    color: '#333',
  },
  welcomeCarousel: {
    marginBottom: 20,
  },
  welcomeCarouselContent: {
    paddingRight: 20,
  },
  welcomeCard: {
    width: width * 0.7, // Ancho de la tarjeta del 70% de la pantalla
    marginRight: 15,
    borderRadius: 15,
  },
  cardImage: {
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardContent: {
    padding: 15,
  },
  cardSubtitle: {
    marginTop: 5,
    color: '#888',
  },
  categoriesSection: {
    marginBottom: 20,
  },
  categoriesContent: {
    alignItems: 'center',
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  categoryIcon: {
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    padding: 5,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 12,
    color: '#333',
  },
  recommendedSection: {
  },
  recommendedCard: {
    marginBottom: 10,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendedCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  recommendedImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  recommendedTextContent: {
    flex: 1,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendedSubtitle: {
    fontSize: 14,
    color: '#888',
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

export default HomeScreen;