import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const SCHOOL = {
  nome: 'E.E. Profª Sueli da Silveira Marin Batista',
  nomeCurto: 'Sueli da Silveira Marin Batista',
  cidade: 'Jales - SP',
};

const API_PORT = 3333;

function resolverHost() {
  const hostUri = Constants.expoConfig?.hostUri; 
  if (hostUri) return hostUri.split(':')[0];
  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
}

export const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${resolverHost()}:${API_PORT}`;
