// ── INPAMIND — Home Screen ──
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';
import { logout } from '../api';

export default function HomeScreen({ navigation, user, onLogout }) {
  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: async () => { await logout(); onLogout(); } },
    ]);
  };

  return (
    <LinearGradient colors={[COLORS.bg1, COLORS.bg2, COLORS.bg3]} style={styles.container}>
      <View style={styles.content}>
        {/* Logout */}
        <View style={styles.topBar}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={16} color="#fff" />
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <View style={[styles.logoCard, SHADOWS.logo]}>
          <Text style={styles.logoText}>INPAMIND</Text>
          <Text style={styles.logoSub}>INGENIERÍA EN PANELES</Text>
        </View>

        <Text style={styles.subtitle}>SISTEMA DE GESTIÓN DE{'\n'}VISITAS TÉCNICAS</Text>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Ionicons name="person-circle-outline" size={36} color={COLORS.cyan} />
          <View>
            <Text style={styles.welcomeLabel}>Bienvenido</Text>
            <Text style={styles.welcomeName}>{user?.name || 'Usuario'}</Text>
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={[styles.btnCyan, SHADOWS.button]}
          onPress={() => navigation.navigate('NuevaVisita')}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
          <Text style={styles.btnCyanText}>NUEVA VISITA</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnGlass}
          onPress={() => navigation.navigate('Historial')}
          activeOpacity={0.7}
        >
          <Ionicons name="time-outline" size={20} color="#fff" />
          <Text style={styles.btnGlassText}>HISTORIAL DE VISITAS</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>INPAMIND © 2026 · {user?.name}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 20,
  },
  topBar: { flexDirection: 'row', alignSelf: 'stretch', marginBottom: 8 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.inBg, borderRadius: 24,
    paddingVertical: 8, paddingHorizontal: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  logoutText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  logoCard: {
    backgroundColor: '#fff', borderRadius: 20,
    paddingVertical: 24, paddingHorizontal: 40,
    alignItems: 'center', marginBottom: 16,
  },
  logoText: { fontSize: 32, fontWeight: '900', color: '#1A2E57', letterSpacing: 5 },
  logoSub: { fontSize: 8, color: '#999', letterSpacing: 3, marginTop: 4 },
  subtitle: {
    fontSize: 13, color: COLORS.t70, letterSpacing: 2.5,
    textAlign: 'center', lineHeight: 22, marginBottom: 24,
  },
  welcomeCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.cardBg, borderWidth: 1, borderColor: COLORS.cardBd,
    borderRadius: 20, padding: 16, paddingHorizontal: 20,
    width: '100%', maxWidth: 340, marginBottom: 32,
  },
  welcomeLabel: { fontSize: 11, color: COLORS.t50, letterSpacing: 1 },
  welcomeName: { fontSize: 17, fontWeight: '700', color: COLORS.cyan, marginTop: 2 },
  btnCyan: {
    width: '100%', maxWidth: 320, borderRadius: 30,
    paddingVertical: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: COLORS.cyan, marginBottom: 14,
  },
  btnCyanText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  btnGlass: {
    width: '100%', maxWidth: 320, borderRadius: 30,
    paddingVertical: 14, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: COLORS.inBg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  btnGlassText: { color: '#fff', fontSize: 15, fontWeight: '600', letterSpacing: 0.5 },
  footer: { marginTop: 'auto', paddingTop: 24, fontSize: 11, color: COLORS.t50, letterSpacing: 2 },
});
