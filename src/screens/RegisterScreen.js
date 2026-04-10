// ── INPAMIND — Register Screen ──
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';
import { register } from '../api';

export default function RegisterScreen({ navigation, onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      return Alert.alert('Error', 'Completa todos los campos');
    }
    if (password.length < 6) {
      return Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
    }
    setLoading(true);
    try {
      const data = await register(name.trim(), email.trim(), password);
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
          <View style={[styles.logoCard, SHADOWS.logo]}>
            <Text style={styles.logoText}>INPAMIND</Text>
            <Text style={styles.logoSub}>INGENIERÍA EN PANELES</Text>
          </View>

          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Registro de Vendedor</Text>

          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={18} color={COLORS.cyan} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Nombre completo" placeholderTextColor={COLORS.t40}
              value={name} onChangeText={setName} />
          </View>

          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color={COLORS.cyan} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor={COLORS.t40}
              keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          </View>

          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.cyan} style={styles.inputIcon} />
            <TextInput style={[styles.input, { paddingRight: 48 }]} placeholder="Contraseña (mín. 6 caracteres)"
              placeholderTextColor={COLORS.t40} secureTextEntry={!showPass}
              value={password} onChangeText={setPassword} onSubmitEditing={handleRegister} />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(!showPass)}>
              <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.cyan} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.btnCyan, SHADOWS.button]} onPress={handleRegister} disabled={loading} activeOpacity={0.85}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnCyanText}>CREAR CUENTA</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 18 }}>
            <Text style={styles.linkText}>¿Ya tienes cuenta? <Text style={{ color: COLORS.cyan, fontWeight: '600' }}>Inicia sesión</Text></Text>
          </TouchableOpacity>
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
    paddingVertical: 20, paddingHorizontal: 32,
    alignItems: 'center', marginBottom: 24,
  },
  logoText: { fontSize: 28, fontWeight: '900', color: '#1A2E57', letterSpacing: 5 },
  logoSub: { fontSize: 7, color: '#999', letterSpacing: 3, marginTop: 3 },
  title: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 12, color: COLORS.t70, marginBottom: 24 },
  inputWrap: { width: '100%', maxWidth: 360, position: 'relative', marginBottom: 14 },
  inputIcon: { position: 'absolute', left: 14, top: 16, zIndex: 1 },
  input: {
    width: '100%', backgroundColor: COLORS.inBg,
    borderWidth: 1, borderColor: COLORS.inBd, borderRadius: 14,
    paddingVertical: 14, paddingLeft: 44, paddingRight: 14,
    color: '#fff', fontSize: 15,
  },
  eyeBtn: { position: 'absolute', right: 14, top: 14, padding: 2 },
  btnCyan: {
    width: '100%', maxWidth: 360, borderRadius: 30, paddingVertical: 16,
    alignItems: 'center', marginTop: 6, backgroundColor: COLORS.cyan,
  },
  btnCyanText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  linkText: { fontSize: 13, color: COLORS.t70 },
});
