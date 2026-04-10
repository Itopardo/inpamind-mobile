// ── INPAMIND — Nueva Visita Screen ──
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, Image, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SHADOWS } from '../theme';
import { createVisit } from '../api';

export default function NuevaVisitaScreen({ navigation }) {
  const now = new Date();
  const [fecha, setFecha] = useState(now.toISOString().split('T')[0]);
  const [hora, setHora] = useState(
    String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')
  );
  const [cliente, setCliente] = useState('');
  const [direccion, setDireccion] = useState('');
  const [contacto, setContacto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async (useCamera) => {
    const opts = {
      mediaTypes: ['images'],
      quality: 0.8,
      base64: true,
      allowsEditing: true,
    };

    let result;
    if (useCamera) {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) return Alert.alert('Permiso', 'Se necesita acceso a la cámara');
      result = await ImagePicker.launchCameraAsync(opts);
    } else {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return Alert.alert('Permiso', 'Se necesita acceso a la galería');
      result = await ImagePicker.launchImageLibraryAsync(opts);
    }

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0]);
    }
  };

  const handleSave = async () => {
    if (!cliente.trim()) return Alert.alert('Error', 'El campo Cliente es obligatorio');
    if (!direccion.trim()) return Alert.alert('Error', 'El campo Dirección es obligatorio');
    setLoading(true);
    try {
      const body = {
        fecha, hora,
        cliente: cliente.trim(),
        direccion: direccion.trim(),
        contacto: contacto.trim(),
        descripcion: descripcion.trim(),
      };
      if (photo?.base64) {
        body.foto_base64 = `data:image/jpeg;base64,${photo.base64}`;
      }
      await createVisit(body);
      Alert.alert('✓ Éxito', 'Visita guardada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setLoading(false);
  };

  return (
    <LinearGradient colors={[COLORS.bg1, COLORS.bg2, COLORS.bg3]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Ionicons name="add-circle" size={22} color={COLORS.cyan} />
        <Text style={styles.headerTitle}>Nueva Visita Técnica</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={styles.card}>
          {/* Fecha y Hora */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}><Ionicons name="calendar-outline" size={12} color={COLORS.cyan} /> Fecha *</Text>
              <TextInput style={styles.inp} value={fecha} onChangeText={setFecha} placeholder="AAAA-MM-DD" placeholderTextColor={COLORS.t40} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}><Ionicons name="time-outline" size={12} color={COLORS.cyan} /> Hora *</Text>
              <TextInput style={styles.inp} value={hora} onChangeText={setHora} placeholder="HH:MM" placeholderTextColor={COLORS.t40} />
            </View>
          </View>

          {/* Cliente */}
          <Text style={styles.label}><Ionicons name="business-outline" size={12} color={COLORS.cyan} /> Cliente *</Text>
          <TextInput style={styles.inp} value={cliente} onChangeText={setCliente} placeholder="Nombre del cliente" placeholderTextColor={COLORS.t40} />

          {/* Dirección */}
          <Text style={styles.label}><Ionicons name="location-outline" size={12} color={COLORS.cyan} /> Dirección *</Text>
          <TextInput style={styles.inp} value={direccion} onChangeText={setDireccion} placeholder="Dirección de visita" placeholderTextColor={COLORS.t40} />

          {/* Contacto */}
          <Text style={styles.label}><Ionicons name="call-outline" size={12} color={COLORS.cyan} /> Contacto</Text>
          <TextInput style={styles.inp} value={contacto} onChangeText={setContacto} placeholder="Nombre / teléfono de contacto" placeholderTextColor={COLORS.t40} />

          {/* Descripción */}
          <Text style={styles.label}><Ionicons name="document-text-outline" size={12} color={COLORS.cyan} /> Descripción</Text>
          <TextInput
            style={[styles.inp, { minHeight: 100, textAlignVertical: 'top' }]}
            multiline
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Detalle la visita, productos consultados, acuerdos..."
            placeholderTextColor={COLORS.t40}
          />

          {/* Foto */}
          <Text style={styles.label}><Ionicons name="camera-outline" size={12} color={COLORS.cyan} /> Foto</Text>
          {!photo ? (
            <View style={styles.photoBtns}>
              <TouchableOpacity style={styles.photoPick} onPress={() => pickImage(true)}>
                <Ionicons name="camera" size={28} color={COLORS.cyan} />
                <Text style={styles.photoPickText}>📷 Cámara</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoPick} onPress={() => pickImage(false)}>
                <Ionicons name="images" size={28} color={COLORS.cyan} />
                <Text style={styles.photoPickText}>🖼️ Galería</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoPreview}>
              <Image source={{ uri: photo.uri }} style={styles.photoImg} />
              <TouchableOpacity style={styles.photoRm} onPress={() => setPhoto(null)}>
                <Text style={{ color: '#fff', fontSize: 16 }}>✕</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Save */}
          <TouchableOpacity
            style={[styles.saveBtn, SHADOWS.button]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>GUARDAR VISITA</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 56 : 16, paddingBottom: 12,
  },
  backBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12,
    padding: 8, marginRight: 4,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff', flex: 1 },
  scroll: { flex: 1 },
  card: {
    backgroundColor: COLORS.cardBg, borderWidth: 1, borderColor: COLORS.cardBd,
    borderRadius: 20, padding: 20,
  },
  row: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  label: {
    color: COLORS.t70, fontSize: 12, fontWeight: '600',
    marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase',
  },
  inp: {
    backgroundColor: COLORS.inBg, borderWidth: 1, borderColor: COLORS.inBd,
    borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14,
    color: '#fff', fontSize: 14, marginBottom: 14,
  },
  photoBtns: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  photoPick: {
    flex: 1, backgroundColor: COLORS.inBg, borderWidth: 1, borderColor: COLORS.inBd,
    borderRadius: 14, paddingVertical: 20, alignItems: 'center',
  },
  photoPickText: { fontSize: 12, color: COLORS.t70, marginTop: 6, fontWeight: '500' },
  photoPreview: { borderRadius: 14, overflow: 'hidden', marginBottom: 18, position: 'relative' },
  photoImg: { width: '100%', height: 200, borderRadius: 14 },
  photoRm: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 15,
    width: 30, height: 30, alignItems: 'center', justifyContent: 'center',
  },
  saveBtn: {
    borderRadius: 30, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: COLORS.cyan, marginTop: 4,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 1 },
});
