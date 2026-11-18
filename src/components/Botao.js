import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

const VARIANTES = {
  primario: { bg: colors.primary, fg: '#fff' },
  destaque: { bg: colors.accent, fg: colors.primaryDark },
  sucesso: { bg: colors.present, fg: '#fff' },
  suave: { bg: '#E0E7FF', fg: colors.primary },
  perigo: { bg: colors.absentSoft, fg: colors.absent },
};

export default function Botao({ titulo, onPress, icone, variante = 'primario', carregando, desabilitado, style }) {
  const v = VARIANTES[variante];
  const inativo = desabilitado || carregando;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={inativo}
      style={[styles.botao, { backgroundColor: v.bg }, inativo && styles.inativo, style]}
    >
      {carregando ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <>
          {!!icone && <Ionicons name={icone} size={20} color={v.fg} />}
          <Text style={[styles.texto, { color: v.fg }]}>{titulo}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  inativo: { opacity: 0.55 },
  texto: { fontSize: 16, fontWeight: '700' },
});
