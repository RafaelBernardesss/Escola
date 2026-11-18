import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, serieAccents } from '../constants/colors';
import { plural } from '../utils/format';

export default function SerieCard({ serie, indice, onPress, onChamada, onLongPress }) {
  const cor = serieAccents[indice % serieAccents.length];

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} onLongPress={onLongPress} style={styles.card}>
      <View style={[styles.faixa, { backgroundColor: cor }]} />

      <View style={[styles.icone, { backgroundColor: cor + '22' }]}>
        <Ionicons name="school" size={26} color={cor} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.nome} numberOfLines={1}>
          {serie.nome}
        </Text>
        <Text style={styles.info}>{plural(serie.totalAlunos, 'aluno', 'alunos')}</Text>
      </View>

      <TouchableOpacity
        onPress={onChamada}
        disabled={serie.totalAlunos === 0}
        style={[styles.chamada, { backgroundColor: cor }, serie.totalAlunos === 0 && { opacity: 0.35 }]}
      >
        <Ionicons name="checkmark-done" size={18} color="#fff" />
        <Text style={styles.chamadaTexto}>Chamada</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 14,
    paddingLeft: 20,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  faixa: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 6 },
  icone: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  nome: { fontSize: 17, fontWeight: '800', color: colors.text },
  info: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  chamada: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  chamadaTexto: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
