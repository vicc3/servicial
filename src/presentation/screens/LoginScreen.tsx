import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { signInWithEmailAndPassword } from '../../config/firebase'; 

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(email, password);
      if (result.success) {
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Credenciales incorrectas');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Servicial</Text>

      <TextInput
        label="Correo o Teléfono"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="magnify" />}
      />

      <TextInput
        label="Introducir contraseña"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry={!passwordVisible}
        style={styles.input}
        right={
          <TextInput.Icon
            icon={passwordVisible ? 'eye-off' : 'eye'}
            onPress={() => setPasswordVisible(!passwordVisible)}
          />
        }
      />

      <Button 
        mode="contained" 
        style={styles.loginButton} 
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
      >
        Iniciar sesión
      </Button>

      <Button 
        mode="contained-tonal" 
        style={styles.registerButton} 
        onPress={() => navigation.navigate('RegisterMenu')}
        disabled={loading}
      >
        Registrarse
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    alignSelf: 'center',
    marginBottom: 40,
    fontWeight: '600',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
  },
  loginButton: {
    marginTop: 10,
    backgroundColor: '#6a5bff',
    borderRadius: 8,
  },
  registerButton: {
    marginTop: 10,
    backgroundColor: '#ebe5ff',
    borderRadius: 8,
  },
});

export default LoginScreen;
