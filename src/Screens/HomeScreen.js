import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import SerieCard from '../components/SerieCard';
import ModalNome from '../components/ModalNome';
import EmptyState from '../components/EmptyState';
import Botao from '../components/Botao';
import { colors } from '../constants/colors';
import { atualizarSerie, criarSerie, listarSeries, removerSerie } from '../service/serieService';
import { mensagemDeErro } from '../service/api';
import { formatarLongo, hojeISO } from '../utils/date';

export default function HomeScreen({ navigation }) {
  const [series, setSeries] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(null);

  const [modalNova, setModalNova] = useState(false);
  const [serieEditando, setSerieEditando] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setErro(null);
      setSeries(await listarSeries());
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function adicionar(nome) {
    try {
      await criarSerie(nome);
      setModalNova(false);
      carregar();
    } catch (e) {
      Alert.alert('Ops!', mensagemDeErro(e));
      return false;
    }
  }

  async function renomear(nome) {
    try {
      await atualizarSerie(serieEditando.id, nome);
      setSerieEditando(null);
      carregar();
    } catch (e) {
      Alert.alert('Ops!', mensagemDeErro(e));
      return false;
    }
  }

  function opcoes(serie) {
    Alert.alert(serie.nome, 'O que você deseja fazer?', [
      { text: 'Renomear', onPress: () => setSerieEditando(serie) },
      {
        text: 'Excluir série',
        style: 'destructive',
        onPress: () =>
          Alert.alert(
            'Excluir série?',
            `Todos os alunos e chamadas de "${serie.nome}" serão apagados. Essa ação não pode ser desfeita.`,
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                  try {
                    await removerSerie(serie.id);
                    carregar();
                  } catch (e) {
                    Alert.alert('Ops!', mensagemDeErro(e));
                  }
                },
              },
            ]
          ),
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.dataBox}>
        <Text style={styles.dataTexto}>{formatarLongo(hojeISO())}</Text>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : erro ? (
        <View style={{ padding: 24 }}>
          <EmptyState icone="cloud-offline-outline" titulo="Sem conexão com o servidor" texto={erro} />
          <Botao titulo="Tentar novamente" icone="refresh" onPress={carregar} />
        </View>
      ) : (
        <FlatList
          data={series}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => {
                setAtualizando(true);
                carregar();
              }}
              colors={[colors.primary]}
            />
          }
          ListHeaderComponent={<Text style={styles.secao}>Suas séries</Text>}
          ListEmptyComponent={
            <EmptyState
              icone="school-outline"
              titulo="Nenhuma série cadastrada"
              texto="Toque em “Adicionar série” para criar a primeira turma e começar a fazer a chamada."
            />
          }
          renderItem={({ item, index }) => (
            <SerieCard
              serie={item}
              indice={index}
              onPress={() => navigation.navigate('Serie', { serie: item })}
              onChamada={() => navigation.navigate('Chamada', { serie: item })}
              onLongPress={() => opcoes(item)}
            />
          )}
          ListFooterComponent={
            series.length > 0 ? <Text style={styles.dica}>Dica: segure o dedo sobre uma série para renomear ou excluir.</Text> : null
          }
        />
      )}

      {!carregando && !erro && (
        <View style={styles.rodape}>
          <Botao titulo="Adicionar série" icone="add-circle" variante="destaque" onPress={() => setModalNova(true)} />
        </View>
      )}

      <ModalNome
        visivel={modalNova}
        titulo="Nova série"
        placeholder="Ex.: 6º Ano A"
        icone="school-outline"
        textoBotao="Criar"
        onSalvar={adicionar}
        onFechar={() => setModalNova(false)}
      />

      <ModalNome
        visivel={!!serieEditando}
        titulo="Renomear série"
        placeholder="Nome da série"
        valorInicial={serieEditando?.nome}
        onSalvar={renomear}
        onFechar={() => setSerieEditando(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  dataBox: {
    alignSelf: 'center',
    marginTop: -16,
    backgroundColor: colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    elevation: 4,
  },
  dataTexto: { color: colors.primaryDark, fontWeight: '800', fontSize: 13 },
  lista: { padding: 20, paddingBottom: 110 },
  secao: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 14 },
  dica: { textAlign: 'center', color: colors.textMuted, fontSize: 12, marginTop: 6 },
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
