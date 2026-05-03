import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

export default function Index() {
  const { isLoaded, session } = useAuthStore();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ABC270' }}>
        <ActivityIndicator size="large" color="#52651E" />
      </View>
    );
  }

  // Jika sudah login, langsung ke home. Jika belum, ke splash (login/register)
  return <Redirect href={session ? '/home' : '/splash'} />;
}
