import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function EmptyState({ icone = 'book-outline', titulo, texto }) {
  return (
    <View style={styles.container}>
      <View style={styles.circulo}>
        <Ionicons name={icone} size={42} color={colors.primaryLight} />
      </View>
      <Text style={styles.titulo}>{titulo}</Text>
      {!!texto && <Text style={styles.texto}>{texto}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32 },
  circulo: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  titulo: { fontSize: 18, fontWeight: '800', color: colors.text, textAlign: 'center' },
  texto: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: 6, lineHeight: 20 },
});
