import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/Screens/HomeScreen';
import SerieScreen from './src/Screens/SerieScreen';
import ChamadaScreen from './src/Screens/ChamadaScreen';
import HistoricoScreen from './src/Screens/HistoricoScreen';
import { colors } from './src/constants/colors';

const Stack = createNativeStackNavigator();

const tema = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.background, primary: colors.primary },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={tema}>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Serie" component={SerieScreen} />
          <Stack.Screen name="Chamada" component={ChamadaScreen} />
          <Stack.Screen name="Historico" component={HistoricoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
