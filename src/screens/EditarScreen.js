// ── INPAMIND — Editar Visita Screen ──
import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, Image, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SHADOWS } from '../theme';
import { getVisit, updateVisit } from '../api';
import { API_URL } from '../config';

export default function EditarScreen({ route, navigation, user }) {
  const { visitId } = route.params;
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [cliente, setCliente] = useState('');
  const [direccion, setDireccion] = useState('');
  const [contacto, setContacto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoChanged, setPhotoChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const data = await getVisit(visitId);
          const v = data.visit;
          setFecha(v.fecha || '');
          setHora(v.hora || '');
          setCliente(v.cliente || '');
          setDireccion(v.direccion || '');
          setContacto(v.contacto || '');
          setDescripcion(v.descripcion || '');
          if (v.foto_url) {
            setPhoto({ uri: `${API_URL}${v.foto_url}`, fromServer: true });
          }
        } catch (e) { Alert.alert('Error', e.message); navigation.goBack(); }
      })();
    }, [visitId])
  );

  const pickImage = async (useCamera) => {
    const opts = { mediaTypes: ['images'], quality: 0.8, base64: true, allowsEditing: true };
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
      setPhotoChanged(true);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoChanged(true);
  };

  const handleSave = async () => {
    if (!cliente.trim()) return Alert.alert('Error', 'El campo Cliente es obligatorio');
    if (!direccion.trim()) return Alert.alert('Error', 'El campo Dirección es obligatorio');
    setLoading(true);
    try {
      const body = {
        fecha, hora,
        cliente: cliente.trim(), direccion: direccion.trim(),
        contacto: contacto.trim(), descripcion: descripcion.trim(),
      };
      if (photoChanged) {
        if (!photo) body.remove_photo = 'true';
        else if (photo.base64) body.foto_base64 = `data:image/jpeg;base64,${photo.base64}`;
      }
      await updateVisit(visitId, body, user?.role === 'admin');
      Alert.alert('✓ Éxito', 'Visita actualizada', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) { Alert.alert('Error', e.message); }
    setLoading(false);
  };

  return (
    <LinearGradient colors={[COLORS.bg1, COLORS.bg2, COLORS.bg3]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Visita</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Fecha</Text>
              <TextInput style={styles.inp} value={fecha} onChangeText={setFecha} placeholderTextColor={COLORS.t40} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Hora</Text>
              <TextInput style={styles.inp} value={hora} onChangeText={setHora} placeholderTextColor={COLORS.t40} />
            </View>
          </View>

          <Text style={styles.label}>Cliente *</Text>
          <TextInput style={styles.inp} value={cliente} onChangeText={setCliente} placeholderTextColor={COLORS.t40} />

          <Text style={styles.label}>Dirección *</Text>
          <TextInput style={styles.inp} value={direccion} onChangeText={setDireccion} placeholderTextColor={COLORS.t40} />

          <Text style={styles.label}>Contacto</Text>
          <TextInput style={styles.inp} value={contacto} onChangeText={setContacto} placeholderTextColor={COLORS.t40} />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.inp, { minHeight: 100, textAlignVertical: 'top' }]}
            multiline value={descripcion} onChangeText={setDescripcion} placeholderTextColor={COLORS.t40}
          />

          <Text style={styles.label}>Foto</Text>
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
              <TouchableOpacity style={styles.photoRm} onPress={removePhoto}>
                <Text style={{ color: '#fff', fontSize: 16 }}>✕</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.saveBtn, SHADOWS.button]}
            onPress={handleSave} disabled={loading} activeOpacity={0.85}
          >
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Ionicons name="save-outline" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>GUARDAR CAMBIOS</Text>
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
  backBtn: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff', flex: 1, textAlign: 'center' },
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
