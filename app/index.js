import { Redirect } from 'expo-router';
import { useUserStore } from '../store/useUserStore';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { isLoaded, hasOnboarded } = useUserStore();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ABC270' }}>
        <ActivityIndicator size="large" color="#52651E" />
      </View>
    );
  }

  return <Redirect href={hasOnboarded ? "/home" : "/splash"} />;
}