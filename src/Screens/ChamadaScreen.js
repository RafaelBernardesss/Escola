import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import ChamadaItem from '../components/ChamadaItem';
import EmptyState from '../components/EmptyState';
import Botao from '../components/Botao';
import { colors } from '../constants/colors';
import { buscarChamada, salvarChamada } from '../service/chamadaService';
import { mensagemDeErro } from '../service/api';
import { formatarLongo, hojeISO, somarDias } from '../utils/date';

export default function ChamadaScreen({ route, navigation }) {
  const { serie } = route.params;

  const [data, setData] = useState(route.params.data || hojeISO());
  const [registros, setRegistros] = useState([]);
  const [chamadaRealizada, setChamadaRealizada] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [alterado, setAlterado] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const resposta = await buscarChamada(serie.id, data);
      setRegistros(resposta.registros);
      setChamadaRealizada(resposta.chamadaRealizada);
      setAlterado(false);
    } catch (e) {
      Alert.alert('Ops!', mensagemDeErro(e));
    } finally {
      setCarregando(false);
    }
  }, [serie.id, data]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const { presentes, faltas } = useMemo(() => {
    const p = registros.filter((r) => r.presente).length;
    return { presentes: p, faltas: registros.length - p };
  }, [registros]);

  function alternar(alunoId) {
    setRegistros((atual) => atual.map((r) => (r.alunoId === alunoId ? { ...r, presente: !r.presente } : r)));
    setAlterado(true);
  }

  function marcarTodos(valor) {
    setRegistros((atual) => atual.map((r) => ({ ...r, presente: valor })));
    setAlterado(true);
  }

  function trocarDia(delta) {
    if (alterado) {
      Alert.alert('Alterações não salvas', 'Se trocar de dia agora, as marcações atuais serão perdidas.', [
        { text: 'Continuar aqui', style: 'cancel' },
        { text: 'Trocar de dia', style: 'destructive', onPress: () => setData((d) => somarDias(d, delta)) },
      ]);
      return;
    }
    setData((d) => somarDias(d, delta));
  }

  async function salvar() {
    setSalvando(true);
    try {
      const resp = await salvarChamada(
        serie.id,
        data,
        registros.map((r) => ({ alunoId: r.alunoId, presente: r.presente }))
      );
      setChamadaRealizada(true);
      setAlterado(false);
      Alert.alert('Chamada salva! ✅', `${resp.presentes} presentes e ${resp.faltas} faltas.`, [
        { text: 'Ver histórico', onPress: () => navigation.replace('Historico', { serie }) },
        { text: 'OK' },
      ]);
    } catch (e) {
      Alert.alert('Ops!', mensagemDeErro(e));
    } finally {
      setSalvando(false);
    }
  }

  const ehHoje = data === hojeISO();

  return (
    <View style={styles.container}>
      <Header titulo="Chamada" subtitulo={serie.nome} onBack={() => navigation.goBack()} />

      {/* Seletor de data */}
      <View style={styles.seletorData}>
        <TouchableOpacity onPress={() => trocarDia(-1)} style={styles.seta}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.dataTexto}>{formatarLongo(data)}</Text>
          <Text style={[styles.dataStatus, { color: chamadaRealizada ? colors.present : colors.textMuted }]}>
            {chamadaRealizada ? 'Chamada já registrada' : ehHoje ? 'Hoje · chamada pendente' : 'Chamada pendente'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => trocarDia(1)} style={styles.seta}>
          <Ionicons name="chevron-forward" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Contadores */}
      <View style={styles.contadores}>
        <View style={[styles.contador, { backgroundColor: colors.presentSoft }]}>
          <Text style={[styles.contadorNumero, { color: colors.present }]}>{presentes}</Text>
          <Text style={[styles.contadorLabel, { color: colors.present }]}>Presentes</Text>
        </View>
        <View style={[styles.contador, { backgroundColor: colors.absentSoft }]}>
          <Text style={[styles.contadorNumero, { color: colors.absent }]}>{faltas}</Text>
          <Text style={[styles.contadorLabel, { color: colors.absent }]}>Faltas</Text>
        </View>
        <View style={[styles.contador, { backgroundColor: '#E0E7FF' }]}>
          <Text style={[styles.contadorNumero, { color: colors.primary }]}>{registros.length}</Text>
          <Text style={[styles.contadorLabel, { color: colors.primary }]}>Total</Text>
        </View>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={registros}
          keyExtractor={(item) => String(item.alunoId)}
          contentContainerStyle={styles.lista}
          ListHeaderComponent={
            registros.length > 0 ? (
              <View style={styles.atalhos}>
                <TouchableOpacity onPress={() => marcarTodos(true)} style={styles.atalho}>
                  <Ionicons name="checkmark-done" size={16} color={colors.present} />
                  <Text style={[styles.atalhoTexto, { color: colors.present }]}>Todos presentes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => marcarTodos(false)} style={styles.atalho}>
                  <Ionicons name="close-circle-outline" size={16} color={colors.absent} />
                  <Text style={[styles.atalhoTexto, { color: colors.absent }]}>Todos faltaram</Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState icone="people-outline" titulo="Nenhum aluno nesta série" texto="Cadastre alunos antes de fazer a chamada." />
          }
          renderItem={({ item, index }) => (
            <ChamadaItem registro={item} numero={index + 1} onAlternar={() => alternar(item.alunoId)} />
          )}
        />
      )}

      {registros.length > 0 && (
        <View style={styles.rodape}>
          <Botao
            titulo={chamadaRealizada ? 'Atualizar chamada' : 'Salvar chamada'}
            icone="save"
            variante="sucesso"
            carregando={salvando}
            onPress={salvar}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  seletorData: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 18,
    padding: 8,
    elevation: 3,
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  seta: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataTexto: { fontSize: 16, fontWeight: '800', color: colors.text },
  dataStatus: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  contadores: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginTop: 14 },
  contador: { flex: 1, borderRadius: 16, paddingVertical: 10, alignItems: 'center' },
  contadorNumero: { fontSize: 24, fontWeight: '900' },
  contadorLabel: { fontSize: 12, fontWeight: '700' },
  lista: { padding: 20, paddingBottom: 110 },
  atalhos: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  atalho: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
  },
  atalhoTexto: { fontSize: 13, fontWeight: '700' },
  rodape: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    paddingBottom: 28,
    backgroundColor: 'rgba(244,246,255,0.96)',
  },
});
