import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { iniciais } from '../utils/format';

// Item da lista de alunos da série (cadastro): editar e remover
export default function AlunoItem({ aluno, numero, onEditar, onRemover }) {
  return (
    <View style={styles.item}>
      <Text style={styles.numero}>{String(numero).padStart(2, '0')}</Text>
      <View style={styles.avatar}>
        <Text style={styles.iniciais}>{iniciais(aluno.nome)}</Text>
      </View>
      <Text style={styles.nome} numberOfLines={2}>
        {aluno.nome}
      </Text>

      <TouchableOpacity onPress={onEditar} style={[styles.acao, { backgroundColor: '#E0E7FF' }]} hitSlop={6}>
        <Ionicons name="pencil" size={17} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onRemover} style={[styles.acao, { backgroundColor: colors.absentSoft }]} hitSlop={6}>
        <Ionicons name="trash" size={17} color={colors.absent} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  numero: { width: 24, fontSize: 13, fontWeight: '700', color: colors.textMuted },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iniciais: { fontWeight: '800', color: '#B45309' },
  nome: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  acao: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
