import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { iniciais } from '../utils/format';

export default function ChamadaItem({ registro, numero, onAlternar }) {
  const presente = registro.presente;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onAlternar}
      style={[styles.item, presente ? styles.itemPresente : styles.itemFalta]}
    >
      <Text style={styles.numero}>{String(numero).padStart(2, '0')}</Text>

      <View style={[styles.avatar, { backgroundColor: presente ? colors.presentSoft : colors.absentSoft }]}>
        <Text style={[styles.iniciais, { color: presente ? colors.present : colors.absent }]}>
          {iniciais(registro.nome)}
        </Text>
      </View>

      <Text style={[styles.nome, !presente && styles.nomeFalta]} numberOfLines={2}>
        {registro.nome}
      </Text>

      <View style={[styles.selo, { backgroundColor: presente ? colors.present : colors.absent }]}>
        <Ionicons name={presente ? 'checkmark' : 'close'} size={16} color="#fff" />
        <Text style={styles.seloTexto}>{presente ? 'Presente' : 'Falta'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
  },
  itemPresente: { backgroundColor: colors.card, borderColor: colors.presentSoft },
  itemFalta: { backgroundColor: '#FFF5F5', borderColor: colors.absentSoft },
  numero: { width: 24, fontSize: 13, fontWeight: '700', color: colors.textMuted },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  iniciais: { fontWeight: '800' },
  nome: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  nomeFalta: { color: colors.absent },
  selo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 12,
    minWidth: 92,
    justifyContent: 'center',
  },
  seloTexto: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
