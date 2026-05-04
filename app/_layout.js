import Constants from 'expo-constants';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { useProgressStore } from '../store/useProgressStore';
import { useUserStore } from '../store/useUserStore';

// ── Startup config validation ─────────────────────────────────────────────────
function checkConfig() {
  const url =
    Constants.expoConfig?.extra?.supabaseUrl ||
    Constants.manifest?.extra?.supabaseUrl ||
    process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key =
    Constants.expoConfig?.extra?.supabaseAnonKey ||
    Constants.manifest?.extra?.supabaseAnonKey ||
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  return { ok: !!(url && key), url, key };
}

// ── Error screen jika config kosong ──────────────────────────────────────────
function ConfigErrorScreen() {
  return (
    <View style={err.container}>
      <Text style={err.title}>⚠️ Konfigurasi Tidak Lengkap</Text>
      <Text style={err.body}>
        Supabase URL atau API Key tidak ditemukan.{'\n\n'}
        Pastikan app.json sudah berisi:{'\n'}
        • extra.supabaseUrl{'\n'}
        • extra.supabaseAnonKey{'\n\n'}
        Hubungi developer untuk perbaikan.
      </Text>
    </View>
  );
}

const err = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '800', color: '#B55C4E', marginBottom: 16, textAlign: 'center' },
  body: { fontSize: 15, color: '#444', lineHeight: 22, textAlign: 'center' },
});

// ── Root Layout ───────────────────────────────────────────────────────────────
export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { init, isLoaded, session, fetchProgress } = useAuthStore();
  const loadFromProfile = useUserStore((s) => s.loadFromProfile);
  const loadFromSupabase = useProgressStore((s) => s.loadFromSupabase);
  const resetUser = useUserStore((s) => s.resetUser);
  const resetProgress = useProgressStore((s) => s.resetProgress);
  const profile = useAuthStore((s) => s.profile);

  // Cek config saat startup — tampilkan error screen jika tidak valid
  const config = checkConfig();
  if (!config.ok) {
    return <ConfigErrorScreen />;
  }

  // Inisialisasi: cek sesi Supabase yang tersimpan
  useEffect(() => {
    init();
  }, []);

  // Saat sesi berubah (login/logout), load data atau reset
  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup =
      segments[0] === 'onboarding' ||
      segments[0] === 'register' ||
      segments[0] === 'splash' ||
      segments[0] === undefined;

    if (session && profile) {
      loadFromProfile(profile);
      fetchProgress().then((progressData) => {
        loadFromSupabase(progressData);
      });
      if (inAuthGroup) {
        router.replace('/home');
      }
    } else {
      resetUser();
      resetProgress();
      if (!inAuthGroup) {
        router.replace('/splash');
      }
    }
  }, [isLoaded, session, profile]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="splash" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="register" />
      <Stack.Screen name="home" />
      <Stack.Screen name="quiz/index" />
      <Stack.Screen name="misi" />
      <Stack.Screen name="karakter" />
      <Stack.Screen name="profil" />
      <Stack.Screen name="isi-misi" />
      <Stack.Screen name="on-misi" />
    </Stack>
  );
}
