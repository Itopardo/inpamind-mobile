// ── INPAMIND Mobile — Main App ──
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from './src/theme';
import { getMe, getStoredUser } from './src/api';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import NuevaVisitaScreen from './src/screens/NuevaVisitaScreen';
import HistorialScreen from './src/screens/HistorialScreen';
import DetalleScreen from './src/screens/DetalleScreen';
import EditarScreen from './src/screens/EditarScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const stored = await getStoredUser();
      if (stored) {
        const data = await getMe();
        setUser(data.user);
      }
    } catch (e) {
      // Token expired or invalid
      setUser(null);
    }
    setLoading(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.cyan} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {!user ? (
          // Auth screens
          <>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {(props) => <RegisterScreen {...props} onLogin={handleLogin} />}
            </Stack.Screen>
          </>
        ) : (
          // App screens
          <>
            <Stack.Screen name="Home">
              {(props) => <HomeScreen {...props} user={user} onLogout={handleLogout} />}
            </Stack.Screen>
            <Stack.Screen name="NuevaVisita">
              {(props) => <NuevaVisitaScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="Historial">
              {(props) => <HistorialScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="Detalle">
              {(props) => <DetalleScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="Editar">
              {(props) => <EditarScreen {...props} user={user} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
