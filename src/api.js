// ── INPAMIND — API Service ──
import * as SecureStore from 'expo-secure-store';
import { API_URL } from './config';

const TOKEN_KEY = 'inpamind_token';
const USER_KEY = 'inpamind_user';

export async function getToken() {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function getStoredUser() {
  const json = await SecureStore.getItemAsync(USER_KEY);
  return json ? JSON.parse(json) : null;
}

export async function setStoredUser(user) {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function removeStoredUser() {
  await SecureStore.deleteItemAsync(USER_KEY);
}

// Generic API call
export async function api(path, opts = {}) {
  const token = await getToken();
  const headers = { ...(opts.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  if (opts.body && !(opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(opts.body);
  }

  const res = await fetch(`${API_URL}${path}`, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Error de servidor');
  return data;
}

// ── Auth ──
export async function login(email, password) {
  const data = await api('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  await setToken(data.token);
  await setStoredUser(data.user);
  return data;
}

export async function register(name, email, password) {
  const data = await api('/api/auth/register', {
    method: 'POST',
    body: { name, email, password },
  });
  await setToken(data.token);
  await setStoredUser(data.user);
  return data;
}

export async function getMe() {
  const data = await api('/api/auth/me');
  await setStoredUser(data.user);
  return data;
}

export async function logout() {
  await removeToken();
  await removeStoredUser();
}

// ── Visits ──
export async function getVisits(search = '') {
  return await api(`/api/visits?search=${encodeURIComponent(search)}`);
}

export async function getVisit(id) {
  return await api(`/api/visits/${id}`);
}

export async function createVisit(visitData) {
  return await api('/api/visits', {
    method: 'POST',
    body: visitData,
  });
}

export async function updateVisit(id, visitData, isAdmin = false) {
  const endpoint = isAdmin ? `/api/admin/visits/${id}` : `/api/visits/${id}`;
  return await api(endpoint, {
    method: 'PUT',
    body: visitData,
  });
}

export async function deleteVisit(id, isAdmin = false) {
  const endpoint = isAdmin ? `/api/admin/visits/${id}` : `/api/visits/${id}`;
  return await api(endpoint, { method: 'DELETE' });
}

// ── Admin ──
export async function getAdminStats() {
  return await api('/api/admin/stats');
}

export async function getAdminVisits(filters = {}) {
  let q = '/api/admin/visits?';
  if (filters.seller) q += `seller=${encodeURIComponent(filters.seller)}&`;
  if (filters.search) q += `search=${encodeURIComponent(filters.search)}&`;
  if (filters.from) q += `from=${filters.from}&`;
  if (filters.to) q += `to=${filters.to}&`;
  return await api(q);
}

export async function getAdminSellers() {
  return await api('/api/admin/sellers');
}

export async function toggleSeller(id) {
  return await api(`/api/admin/sellers/${id}`, { method: 'PUT' });
}
