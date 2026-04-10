// ── INPAMIND — Historial Screen ──
import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, RefreshControl, Platform, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../theme';
import { getVisits, deleteVisit } from '../api';
import { API_URL } from '../config';

function fmtDate(f) {
  if (!f) return '—';
  const p = f.split('-');
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : f;
}

export default function HistorialScreen({ navigation, user }) {
  const [visits, setVisits] = useState([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadVisits = async (q = '') => {
    try {
      const data = await getVisits(q);
      setVisits(data.visits || []);
    } catch (e) {
      Alert.alert('Error', 'No se pudieron cargar las visitas');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadVisits(search);
    }, [search])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVisits(search);
    setRefreshing(false);
  };

  const handleDelete = (id) => {
    Alert.alert('Eliminar Visita', '¿Eliminar esta visita? Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          try {
            await deleteVisit(id, user?.role === 'admin');
            loadVisits(search);
          } catch (e) { Alert.alert('Error', e.message); }
        },
      },
    ]);
  };

  const clients = new Set(visits.map(v => v.cliente));

  return (
    <LinearGradient colors={[COLORS.bg1, COLORS.bg2, COLORS.bg3]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Ionicons name="list" size={22} color={COLORS.cyan} />
        <Text style={styles.headerTitle}>Historial de Visitas</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={16} color={COLORS.t50} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por cliente, dirección..."
          placeholderTextColor={COLORS.t40}
          value={search}
          onChangeText={(t) => { setSearch(t); loadVisits(t); }}
        />
      </View>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Ionicons name="document-text" size={14} color={COLORS.cyan} />
          <Text style={styles.statText}>{visits.length} visitas</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="people" size={14} color={COLORS.cyan} />
          <Text style={styles.statText}>{clients.size} clientes</Text>
        </View>
      </View>

      {/* Visit List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.cyan} />}
      >
        {visits.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="file-tray-outline" size={60} color={COLORS.t40} />
            <Text style={styles.emptyText}>No hay visitas registradas</Text>
            <Text style={styles.emptyHint}>Crea tu primera visita con el botón +</Text>
          </View>
        ) : (
          visits.map((v) => (
            <TouchableOpacity
              key={v.id}
              style={styles.vCard}
              onPress={() => navigation.navigate('Detalle', { visitId: v.id })}
              activeOpacity={0.7}
            >
              <View style={styles.vCardTop}>
                <View style={{ flex: 1 }}>
                  <View style={styles.vClient}>
                    <Ionicons name="business" size={14} color={COLORS.cyan} />
                    <Text style={styles.vClientText}>{v.cliente}</Text>
                  </View>
                  <View style={styles.vMeta}>
                    <Ionicons name="calendar-outline" size={11} color={COLORS.t50} />
                    <Text style={styles.vMetaText}>{fmtDate(v.fecha)}</Text>
                    <Ionicons name="time-outline" size={11} color={COLORS.t50} />
                    <Text style={styles.vMetaText}>{v.hora || '—'}</Text>
                  </View>
                </View>
                {v.foto_url && (
                  <View style={styles.photoInd}>
                    <Ionicons name="camera" size={12} color={COLORS.cyan} />
                    <Text style={{ fontSize: 11, color: COLORS.cyan }}>📷</Text>
                  </View>
                )}
              </View>
              {v.direccion ? (
                <View style={styles.vDetail}>
                  <Ionicons name="location-outline" size={12} color={COLORS.t50} />
                  <Text style={styles.vDetailText}>{v.direccion}</Text>
                </View>
              ) : null}
              {v.contacto ? (
                <View style={styles.vDetail}>
                  <Ionicons name="call-outline" size={12} color={COLORS.t50} />
                  <Text style={styles.vDetailText}>{v.contacto}</Text>
                </View>
              ) : null}
              {v.descripcion ? (
                <View style={styles.descBox}>
                  <Text style={styles.descText} numberOfLines={2}>{v.descripcion}</Text>
                </View>
              ) : null}
              <View style={styles.vActions}>
                <TouchableOpacity
                  style={styles.btnEdit}
                  onPress={() => navigation.navigate('Editar', { visitId: v.id })}
                >
                  <Ionicons name="create-outline" size={14} color={COLORS.cyan} />
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.cyan }}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnDel} onPress={() => handleDelete(v.id)}>
                  <Ionicons name="trash-outline" size={14} color={COLORS.danger} />
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.danger }}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
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
  searchWrap: { position: 'relative', marginHorizontal: 16, marginBottom: 10 },
  searchIcon: { position: 'absolute', left: 14, top: 14, zIndex: 1 },
  searchInput: {
    backgroundColor: COLORS.inBg, borderWidth: 1, borderColor: COLORS.inBd,
    borderRadius: 14, paddingVertical: 12, paddingLeft: 42, paddingRight: 14,
    color: '#fff', fontSize: 13,
  },
  statsBar: {
    flexDirection: 'row', gap: 16,
    backgroundColor: 'rgba(65,198,246,0.1)', borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 16, marginHorizontal: 16, marginBottom: 10,
  },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 14, color: COLORS.t50, marginTop: 12 },
  emptyHint: { fontSize: 12, color: COLORS.t40, marginTop: 8 },
  vCard: {
    backgroundColor: COLORS.cardBg, borderWidth: 1, borderColor: COLORS.cardBd,
    borderRadius: 16, padding: 14, marginBottom: 10,
  },
  vCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  vClient: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  vClientText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  vMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  vMetaText: { fontSize: 11, color: COLORS.t50 },
  vDetail: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  vDetailText: { fontSize: 12, color: COLORS.t70 },
  descBox: {
    backgroundColor: 'rgba(255,255,255,0.04)', borderLeftWidth: 3, borderLeftColor: COLORS.amber,
    borderRadius: 8, padding: 8, paddingHorizontal: 12, marginTop: 8,
  },
  descText: { fontSize: 12, color: COLORS.t65, fontStyle: 'italic' },
  photoInd: {
    backgroundColor: 'rgba(65,198,246,0.15)', borderRadius: 8,
    paddingVertical: 4, paddingHorizontal: 8,
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  vActions: {
    flexDirection: 'row', gap: 8, marginTop: 10,
    paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
  },
  btnEdit: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(65,198,246,0.12)',
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10,
  },
  btnDel: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,68,68,0.12)',
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10,
  },
});
