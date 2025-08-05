import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Appbar, Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; //icono

type Props = NativeStackScreenProps<RootStackParamList, 'RegisterMenu'>;

const RegisterMenuScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme(); 

  return (
    <View style={styles.fullScreenContainer}>
      <Appbar.Header style={{ backgroundColor: 'transparent', elevation: 0 }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <Title style={styles.mainTitle}>Registrarse Como</Title>

        <Card
          style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}
          // Se envía el rol 'user' como parámetro
          onPress={() => navigation.navigate('RegistrationScreen', { role: 'user' })}
        >
          <Card.Content style={styles.cardContent}>
            <Icon name="account" size={40} color={theme.colors.primary} /> 
            <Paragraph style={[styles.cardText, { color: theme.colors.onSurfaceVariant }]}>Cliente</Paragraph>
          </Card.Content>
        </Card>

        <Card
          style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}
          // Se envía el rol 'worker' como parámetro
          onPress={() => navigation.navigate('RegistrationScreen', { role: 'worker' })}
        >
          <Card.Content style={styles.cardContent}>
            <Icon name="briefcase" size={40} color={theme.colors.primary} />
            <Paragraph style={[styles.cardText, { color: theme.colors.onSurfaceVariant }]}>Trabajador</Paragraph>
          </Card.Content>
        </Card>

        <Button
          mode="text" 
          onPress={() => navigation.navigate('Login')} 
          style={styles.cancelButton}
          labelStyle={{ color: theme.colors.primary }} 
        >
          Cancelar
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff', 
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center', 
  },
  mainTitle: {
    fontSize: 28, 
    fontWeight: 'bold',
    marginBottom: 40, 
    textAlign: 'center',
    color: '#333', 
  },
  card: {
    width: '80%', 
    borderRadius: 15, 
    paddingVertical: 20,
    marginBottom: 20, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    alignItems: 'center', 
  },
  cardText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 30, 
    width: '80%', 
  },
});

export default RegisterMenuScreen;
