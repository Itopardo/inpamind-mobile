// ── INPAMIND — Detalle de Visita Screen ──
import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, Modal, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../theme';
import { getVisit, deleteVisit } from '../api';
import { API_URL } from '../config';

function fmtDate(f) {
  if (!f) return '—';
  const p = f.split('-');
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : f;
}

export default function DetalleScreen({ route, navigation, user }) {
  const { visitId } = route.params;
  const [visit, setVisit] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const data = await getVisit(visitId);
          setVisit(data.visit);
        } catch (e) { Alert.alert('Error', e.message); navigation.goBack(); }
      })();
    }, [visitId])
  );

  const handleDelete = () => {
    Alert.alert('Eliminar Visita', '¿Eliminar esta visita?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          try {
            await deleteVisit(visitId, user?.role === 'admin');
            navigation.goBack();
          } catch (e) { Alert.alert('Error', e.message); }
        },
      },
    ]);
  };

  if (!visit) return (
    <LinearGradient colors={[COLORS.bg1, COLORS.bg2, COLORS.bg3]} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: COLORS.t50 }}>Cargando...</Text>
    </LinearGradient>
  );

  const photoUrl = visit.foto_url ? `${API_URL}${visit.foto_url}` : null;

  return (
    <LinearGradient colors={[COLORS.bg1, COLORS.bg2, COLORS.bg3]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Visita</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Editar', { visitId })}>
          <Ionicons name="create-outline" size={18} color={COLORS.cyan} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={styles.card}>
          {/* Client header */}
          <View style={styles.clientHeader}>
            <Ionicons name="business" size={24} color={COLORS.cyan} />
            <Text style={styles.clientName}>{visit.cliente}</Text>
          </View>

          <DetailItem icon="calendar-outline" label="Fecha" value={fmtDate(visit.fecha)} />
          <DetailItem icon="time-outline" label="Hora" value={visit.hora || '—'} />
          <DetailItem icon="location-outline" label="Dirección" value={visit.direccion || '—'} />
          <DetailItem icon="call-outline" label="Contacto" value={visit.contacto || '—'} />

          {visit.descripcion ? (
            <View style={styles.descSection}>
              <View style={styles.descHeader}>
                <Ionicons name="document-text" size={14} color={COLORS.cyan} />
                <Text style={styles.descLabel}>Descripción</Text>
              </View>
              <View style={styles.descBox}>
                <Text style={styles.descText}>{visit.descripcion}</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.timestamps}>
            <Text style={styles.tsText}>
              Creado: {visit.created_at ? new Date(visit.created_at).toLocaleString('es-CL') : '—'}
            </Text>
            <Text style={styles.tsText}>
              Editado: {visit.updated_at ? new Date(visit.updated_at).toLocaleString('es-CL') : '—'}
            </Text>
          </View>
        </View>

        {/* Photo */}
        {photoUrl && (
          <View style={[styles.card, { marginTop: 14 }]}>
            <View style={styles.descHeader}>
              <Ionicons name="camera" size={14} color={COLORS.cyan} />
              <Text style={styles.descLabel}>Foto de la Visita</Text>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image source={{ uri: photoUrl }} style={styles.photo} resizeMode="cover" />
            </TouchableOpacity>
          </View>
        )}

        {/* Actions */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('Editar', { visitId })}
          activeOpacity={0.85}
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.editBtnText}>EDITAR VISITA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
          <Text style={styles.deleteBtnText}>ELIMINAR VISITA</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Photo Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modal}>
          <TouchableOpacity style={styles.modalClose} onPress={() => setModalVisible(false)}>
            <Text style={{ color: '#fff', fontSize: 22 }}>✕</Text>
          </TouchableOpacity>
          {photoUrl && <Image source={{ uri: photoUrl }} style={styles.modalImg} resizeMode="contain" />}
        </View>
      </Modal>
    </LinearGradient>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <View style={styles.detItem}>
      <Ionicons name={icon} size={18} color={COLORS.cyan} style={{ marginTop: 2 }} />
      <View>
        <Text style={styles.detLabel}>{label}</Text>
        <Text style={styles.detValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 56 : 16, paddingBottom: 12,
  },
  backBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 8,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff', flex: 1, textAlign: 'center' },
  card: {
    backgroundColor: COLORS.cardBg, borderWidth: 1, borderColor: COLORS.cardBd,
    borderRadius: 20, padding: 20,
  },
  clientHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)', marginBottom: 16,
  },
  clientName: { fontSize: 20, fontWeight: '800', color: '#fff' },
  detItem: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  detLabel: { fontSize: 10, color: COLORS.t50, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '600' },
  detValue: { fontSize: 14, color: '#fff', marginTop: 2 },
  descSection: { marginTop: 8, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' },
  descHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  descLabel: { fontSize: 12, color: COLORS.t70, fontWeight: '600' },
  descBox: {
    backgroundColor: 'rgba(255,255,255,0.04)', borderLeftWidth: 3, borderLeftColor: COLORS.amber,
    borderRadius: 8, padding: 12,
  },
  descText: { fontSize: 12, color: COLORS.t65, fontStyle: 'italic', lineHeight: 18 },
  timestamps: {
    marginTop: 12, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
  },
  tsText: { fontSize: 10, color: COLORS.t50, marginBottom: 2 },
  photo: { width: '100%', height: 250, borderRadius: 14, marginTop: 10 },
  editBtn: {
    borderRadius: 30, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: COLORS.cyan, marginTop: 14,
  },
  editBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  deleteBtn: {
    borderRadius: 30, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: COLORS.inBg, borderWidth: 1, borderColor: 'rgba(255,68,68,0.3)', marginTop: 10,
  },
  deleteBtnText: { color: COLORS.danger, fontSize: 15, fontWeight: '600' },
  modal: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center', justifyContent: 'center', padding: 16,
  },
  modalClose: {
    position: 'absolute', top: 50, right: 20,
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20,
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    zIndex: 10,
  },
  modalImg: { width: '100%', height: '80%', borderRadius: 14 },
});
