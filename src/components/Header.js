import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { SCHOOL } from '../constants/config';

const logo = require('../../assets/logo-escola.png');

export default function Header({ titulo, subtitulo, onBack, direita }) {
  const insets = useSafeAreaInsets();
  const home = !titulo;

  return (
    <LinearGradient
      colors={[colors.primaryDark, colors.primary, colors.primaryLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top + 12 }, home && styles.containerHome]}
    >
      <View style={styles.circuloGrande} />
      <View style={styles.circuloPequeno} />

      {home ? (
        <View style={styles.homeContent}>
          <View style={styles.logoWrap}>
            <Image source={logo} style={styles.logoGrande} resizeMode="contain" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.escolaLabel}>CHAMADA ESCOLAR</Text>
            <Text style={styles.escolaNome} numberOfLines={3}>
              {SCHOOL.nome}
            </Text>
            <Text style={styles.cidade}>{SCHOOL.cidade}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.linha}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.botaoVoltar} hitSlop={10}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.titulo} numberOfLines={1}>
              {titulo}
            </Text>
            {!!subtitulo && <Text style={styles.subtitulo}>{subtitulo}</Text>}
          </View>
          {direita}
          <Image source={logo} style={styles.logoPequena} resizeMode="contain" />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  containerHome: { paddingBottom: 30 },
  circuloGrande: {
    position: 'absolute',
    right: -50,
    top: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  circuloPequeno: {
    position: 'absolute',
    left: -30,
    bottom: -40,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(245,158,11,0.18)',
  },
  homeContent: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  logoWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  logoGrande: { width: 70, height: 70 },
  escolaLabel: { color: colors.accent, fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  escolaNome: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 2, lineHeight: 23 },
  cidade: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 3 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  botaoVoltar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { color: '#fff', fontSize: 22, fontWeight: '800' },
  subtitulo: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 1 },
  logoPequena: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff' },
});
