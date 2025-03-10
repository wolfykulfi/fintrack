import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <Text style={styles.title}>FinTrack App</Text>
          <Text style={styles.subtitle}>Welcome to your financial tracker!</Text>
          <StatusBar style="auto" />
        </View>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
