import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useProgressStore } from '../store/useProgressStore';
import { useUserStore } from '../store/useUserStore';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { init, isLoaded, session, fetchProgress } = useAuthStore();
  const loadFromProfile = useUserStore((s) => s.loadFromProfile);
  const loadFromSupabase = useProgressStore((s) => s.loadFromSupabase);
  const resetUser = useUserStore((s) => s.resetUser);
  const resetProgress = useProgressStore((s) => s.resetProgress);
  const profile = useAuthStore((s) => s.profile);

  // Inisialisasi: cek sesi Supabase yang tersimpan
  useEffect(() => {
    init();
  }, []);

  // Saat sesi berubah (login/logout), load data atau reset
  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === 'onboarding' || segments[0] === 'register' || segments[0] === 'splash' || segments[0] === undefined;

    if (session && profile) {
      // User sudah login — load data ke store lokal
      loadFromProfile(profile);
      fetchProgress().then((progressData) => {
        loadFromSupabase(progressData);
      });
      // Jika masih di halaman auth, arahkan ke home
      if (inAuthGroup) {
        router.replace('/home');
      }
    } else {
      // User belum login — reset store dan arahkan ke splash
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
