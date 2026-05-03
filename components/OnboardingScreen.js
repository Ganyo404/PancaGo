import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/useAuthStore';

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      Alert.alert('Oops!', 'Username dan kata sandi tidak boleh kosong.');
      return;
    }
    clearError();
    const result = await login({ username: username.trim(), password });
    if (!result.success) {
      Alert.alert('Login Gagal', result.error || 'Username atau kata sandi salah.');
    }
    // Jika sukses, _layout.js akan otomatis redirect ke /home
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <View style={styles.headerArea}>
          <View style={styles.starBadge}>
            <MaterialIcons name="star" size={24} color="#574500" />
          </View>
          <Text style={styles.title}>{'Selamat\nDatang\nKembali!'}</Text>
          <Text style={styles.subtitle}>
            {'Masuk untuk melanjutkan\npetualanganmu di PancaGo!'}
          </Text>
        </View>

        {/* ── Form Card ────────────────────────────────────────────────────── */}
        <View style={styles.card}>

          {/* Username input */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabel}>
              <MaterialIcons name="person" size={14} color="#6b8227" />
              <Text style={styles.fieldLabelText}>Username</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Masukkan username-mu"
              placeholderTextColor="rgba(27,28,28,0.3)"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          {/* Password input */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabel}>
              <MaterialIcons name="lock" size={14} color="#6b8227" />
              <Text style={styles.fieldLabelText}>Kata Sandi</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Masukkan kata sandi"
              placeholderTextColor="rgba(27,28,28,0.3)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>

        </View>

        {/* ── Actions ──────────────────────────────────────────────────────── */}
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && { opacity: 0.85 },
              isLoading && { opacity: 0.7 },
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.primaryBtnText}>Masuk</Text>
                <Text style={styles.rocketEmoji}>🚀</Text>
              </>
            )}
          </Pressable>

          <View style={styles.loginHintRow}>
            <Text style={styles.loginHint}>Belum punya akun? </Text>
            <Pressable onPress={() => router.push('/register')}>
              <Text style={styles.loginLink}>Daftar di sini</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bgGradientBottom} pointerEvents="none" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fbf9f8',
  },
  scroll: {
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 28,
  },
  headerArea: {
    width: '100%',
    alignItems: 'flex-start',
    position: 'relative',
  },
  starBadge: {
    position: 'absolute',
    top: 0,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFE087',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    zIndex: 10,
  },
  title: {
    fontSize: 39,
    fontWeight: '800',
    color: '#1B1C1C',
    letterSpacing: -0.5,
    lineHeight: 42,
    marginTop: 56,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#564334',
    lineHeight: 20,
    marginTop: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    padding: 28,
    gap: 28,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  fieldGroup: {
    gap: 12,
  },
  fieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fieldLabelText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6b8227',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 19,
    fontWeight: '700',
    color: '#1B1C1C',
  },
  actions: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
    marginTop: 4,
  },
  primaryBtn: {
    width: '100%',
    height: 64,
    backgroundColor: '#5E4B3B',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#5E4B3B',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
  },
  rocketEmoji: {
    fontSize: 23,
  },
  loginHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginHint: {
    fontSize: 16,
    color: 'rgba(27,28,28,0.6)',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3b4d06',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
  bgGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(244,235,217,0.15)',
    pointerEvents: 'none',
  },
});
