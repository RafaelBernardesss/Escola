import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';
import { colors } from '../constants/colors';
import { buscarHistorico } from '../service/chamadaService';
import { mensagemDeErro } from '../service/api';
import { formatarCurto, nomeDoDia } from '../utils/date';

export default function HistoricoScreen({ route, navigation }) {
  const { serie } = route.params;
  const [dias, setDias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          setDias(await buscarHistorico(serie.id));
        } catch (e) {
          Alert.alert('Ops!', mensagemDeErro(e));
        } finally {
          setCarregando(false);
        }
      })();
    }, [serie.id])
  );

  return (
    <View style={styles.container}>
      <Header titulo="Histórico" subtitulo={serie.nome} onBack={() => navigation.goBack()} />

      {carregando ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={dias}
          keyExtractor={(item) => item.data}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <EmptyState
              icone="calendar-outline"
              titulo="Nenhuma chamada registrada"
              texto="Quando você salvar a primeira chamada desta série, ela aparecerá aqui."
            />
          }
          renderItem={({ item }) => {
            const total = item.presentes + item.faltas;
            const pct = total ? Math.round((item.presentes / total) * 100) : 0;

            return (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.card}
                onPress={() => navigation.navigate('Chamada', { serie, data: item.data })}
              >
                <View style={styles.dataBox}>
                  <Text style={styles.dataDia}>{item.data.split('-')[2]}</Text>
                  <Text style={styles.dataMes}>{item.data.split('-')[1]}/{item.data.split('-')[0].slice(2)}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.titulo}>{nomeDoDia(item.data)}</Text>
                  <Text style={styles.sub}>
                    {formatarCurto(item.data)} · {item.presentes} presentes · {item.faltas} faltas
                  </Text>
                  <View style={styles.barra}>
                    <View style={[styles.barraPreenchida, { width: `${pct}%` }]} />
                  </View>
                </View>

                <View style={styles.pct}>
                  <Text style={styles.pctTexto}>{pct}%</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  lista: { padding: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  dataBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataDia: { color: '#fff', fontSize: 20, fontWeight: '900', lineHeight: 22 },
  dataMes: { color: colors.accent, fontSize: 11, fontWeight: '700' },
  titulo: { fontSize: 15, fontWeight: '800', color: colors.text },
  sub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  barra: { height: 6, borderRadius: 3, backgroundColor: colors.absentSoft, marginTop: 8, overflow: 'hidden' },
  barraPreenchida: { height: 6, backgroundColor: colors.present, borderRadius: 3 },
  pct: { backgroundColor: colors.presentSoft, borderRadius: 10, paddingVertical: 4, paddingHorizontal: 8 },
  pctTexto: { color: colors.present, fontWeight: '800', fontSize: 12 },
});
