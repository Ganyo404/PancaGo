import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useProgressStore } from '../store/useProgressStore';

export default function RootLayout() {
  const loadUser = useUserStore((s) => s.loadUser);
  const loadProgress = useProgressStore((s) => s.loadProgress);

  // Muat data tersimpan dari AsyncStorage saat aplikasi pertama dibuka
  useEffect(() => {
    loadUser();
    loadProgress();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="splash" />
      <Stack.Screen name="onboarding" />
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
