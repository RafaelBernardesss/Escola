import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Botao from './Botao';
import { colors } from '../constants/colors';

export default function ModalNome({
  visivel,
  titulo,
  placeholder,
  icone = 'create-outline',
  valorInicial = '',
  textoBotao = 'Salvar',
  continuo = false,
  onSalvar,
  onFechar,
}) {
  const [valor, setValor] = useState(valorInicial);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (visivel) setValor(valorInicial);
  }, [visivel, valorInicial]);

  async function salvar() {
    if (valor.trim().length < 2) return;
    setSalvando(true);
    try {
      const ok = await onSalvar(valor);
      if (ok !== false && continuo) setValor('');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onFechar}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.fundo}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onFechar} />
        <View style={styles.caixa}>
          <View style={styles.icone}>
            <Ionicons name={icone} size={26} color={colors.primary} />
          </View>
          <Text style={styles.titulo}>{titulo}</Text>

          <TextInput
            value={valor}
            onChangeText={setValor}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            autoFocus
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={salvar}
          />

          <View style={styles.acoes}>
            <Botao titulo={continuo ? 'Concluir' : 'Cancelar'} variante="suave" onPress={onFechar} style={{ flex: 1 }} />
            <Botao
              titulo={textoBotao}
              onPress={salvar}
              carregando={salvando}
              desabilitado={valor.trim().length < 2}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: 'rgba(15,23,42,0.55)', justifyContent: 'center', padding: 24 },
  caixa: { backgroundColor: '#fff', borderRadius: 24, padding: 22, alignItems: 'center' },
  icone: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  titulo: { fontSize: 19, fontWeight: '800', color: colors.text, marginBottom: 16, textAlign: 'center' },
  input: {
    alignSelf: 'stretch',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  acoes: { flexDirection: 'row', gap: 10, marginTop: 18, alignSelf: 'stretch' },
});
