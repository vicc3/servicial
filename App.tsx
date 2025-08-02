// App.js
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
//comp navegación principal
import AppNavigator from './src/presentation/navigation/index';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200EE',
    accent: '#03DAC6',  
    surfaceVariant: '#f2f2f2', 
    onSurfaceVariant: '#333', 
    background: '#ffffff', 
  },
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <AppNavigator />
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', 
  },
});

export default App;