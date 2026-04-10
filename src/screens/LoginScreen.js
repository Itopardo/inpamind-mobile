// ── INPAMIND — Login Screen ──
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';
import { login } from '../api';

export default function LoginScreen({ navigation, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      return Alert.alert('Error', 'Completa todos los campos');
    }
    setLoading(true);
    try {
      const data = await login(email.trim(), password);
      onLogin(data.user);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setLoading(false);
  };

  return (
    <LinearGradient colors={[COLORS.bg1, COLORS.bg2, COLORS.bg3]} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Logo */}
          <View style={[styles.logoCard, SHADOWS.logo]}>
            <Text style={styles.logoText}>INPAMIND</Text>
            <Text style={styles.logoSub}>INGENIERÍA EN PANELES</Text>
          </View>

          <Text style={styles.subtitle}>SISTEMA DE GESTIÓN DE{'\n'}VISITAS TÉCNICAS</Text>

          {/* Email */}
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color={COLORS.cyan} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor={COLORS.t40}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.cyan} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { paddingRight: 48 }]}
              placeholder="Contraseña"
              placeholderTextColor={COLORS.t40}
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(!showPass)}>
              <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.cyan} />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.btnCyan, SHADOWS.button]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnCyanText}>INICIAR SESIÓN</Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <TouchableOpacity
            style={styles.btnGlass}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.7}
          >
            <Text style={styles.btnGlassText}>CREAR CUENTA</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>INPAMIND © 2026</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 28, paddingVertical: 40,
  },
  logoCard: {
    backgroundColor: '#fff', borderRadius: 20,
    paddingVertical: 24, paddingHorizontal: 40,
    alignItems: 'center', marginBottom: 28,
  },
  logoText: {
    fontSize: 32, fontWeight: '900', color: '#1A2E57',
    letterSpacing: 5,
  },
  logoSub: {
    fontSize: 8, color: '#999', letterSpacing: 3,
    marginTop: 4, fontWeight: '500',
  },
  subtitle: {
    fontSize: 12, color: COLORS.t65, letterSpacing: 2.5,
    textAlign: 'center', marginBottom: 32, lineHeight: 20,
  },
  inputWrap: {
    width: '100%', maxWidth: 360, position: 'relative', marginBottom: 14,
  },
  inputIcon: {
    position: 'absolute', left: 14, top: 16, zIndex: 1,
  },
  input: {
    width: '100%', backgroundColor: COLORS.inBg,
    borderWidth: 1, borderColor: COLORS.inBd, borderRadius: 14,
    paddingVertical: 14, paddingLeft: 44, paddingRight: 14,
    color: '#fff', fontSize: 15,
  },
  eyeBtn: {
    position: 'absolute', right: 14, top: 14,
    padding: 2,
  },
  btnCyan: {
    width: '100%', maxWidth: 360,
    borderRadius: 30, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 6,
    backgroundColor: COLORS.cyan,
  },
  btnCyanText: {
    color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 1,
  },
  btnGlass: {
    width: '100%', maxWidth: 360,
    borderRadius: 30, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 12,
    backgroundColor: COLORS.inBg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  btnGlassText: {
    color: '#fff', fontSize: 15, fontWeight: '600', letterSpacing: 0.5,
  },
  footer: {
    marginTop: 'auto', paddingTop: 32,
    fontSize: 11, color: COLORS.t50, letterSpacing: 2,
  },
});
