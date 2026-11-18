import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import AlunoItem from '../components/AlunoItem';
import ModalNome from '../components/ModalNome';
import EmptyState from '../components/EmptyState';
import Botao from '../components/Botao';
import { colors } from '../constants/colors';
import { atualizarAluno, criarAluno, listarAlunos, removerAluno } from '../service/alunoService';
import { mensagemDeErro } from '../service/api';
import { formatarNome, plural } from '../utils/format';

export default function SerieScreen({ route, navigation }) {
  const { serie } = route.params;

  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalNovo, setModalNovo] = useState(false);
  const [alunoEditando, setAlunoEditando] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setAlunos(await listarAlunos(serie.id));
    } catch (e) {
      Alert.alert('Ops!', mensagemDeErro(e));
    } finally {
      setCarregando(false);
    }
  }, [serie.id]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function adicionar(nome) {
    try {
      const novo = await criarAluno(formatarNome(nome), serie.id);
      setAlunos((atual) => [...atual, novo].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')));
    } catch (e) {
      Alert.alert('Ops!', mensagemDeErro(e));
      return false;
    }
  }

  async function renomear(nome) {
    try {
      await atualizarAluno(alunoEditando.id, formatarNome(nome));
      setAlunoEditando(null);
      carregar();
    } catch (e) {
      Alert.alert('Ops!', mensagemDeErro(e));
      return false;
    }
  }

  function confirmarRemocao(aluno) {
    Alert.alert('Remover aluno?', `${aluno.nome} será removido da turma, junto com o histórico de presença.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await removerAluno(aluno.id);
            setAlunos((atual) => atual.filter((a) => a.id !== aluno.id));
          } catch (e) {
            Alert.alert('Ops!', mensagemDeErro(e));
          }
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Header titulo={serie.nome} subtitulo={plural(alunos.length, 'aluno', 'alunos')} onBack={() => navigation.goBack()} />

      <View style={styles.atalhos}>
        <Botao
          titulo="Fazer chamada"
          icone="checkmark-done"
          variante="sucesso"
          desabilitado={alunos.length === 0}
          onPress={() => navigation.navigate('Chamada', { serie })}
          style={{ flex: 1 }}
        />
        <Botao
          titulo="Histórico"
          icone="calendar"
          variante="suave"
          onPress={() => navigation.navigate('Historico', { serie })}
          style={{ flex: 1 }}
        />
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={alunos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.lista}
          ListHeaderComponent={<Text style={styles.secao}>Alunos da turma</Text>}
          ListEmptyComponent={
            <EmptyState
              icone="people-outline"
              titulo="Turma sem alunos"
              texto="Cadastre os alunos apenas com o nome. Depois é só marcar a presença de cada um."
            />
          }
          renderItem={({ item, index }) => (
            <AlunoItem
              aluno={item}
              numero={index + 1}
              onEditar={() => setAlunoEditando(item)}
              onRemover={() => confirmarRemocao(item)}
            />
          )}
        />
      )}

      <View style={styles.rodape}>
        <Botao titulo="Adicionar aluno" icone="person-add" variante="destaque" onPress={() => setModalNovo(true)} />
      </View>

      <ModalNome
        visivel={modalNovo}
        titulo="Novo aluno"
        placeholder="Nome do aluno"
        icone="person-add-outline"
        textoBotao="Adicionar"
        continuo
        onSalvar={adicionar}
        onFechar={() => setModalNovo(false)}
      />

      <ModalNome
        visivel={!!alunoEditando}
        titulo="Editar nome"
        placeholder="Nome do aluno"
        valorInicial={alunoEditando?.nome}
        onSalvar={renomear}
        onFechar={() => setAlunoEditando(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  atalhos: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginTop: 16 },
  lista: { padding: 20, paddingBottom: 110 },
  secao: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 12 },
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
