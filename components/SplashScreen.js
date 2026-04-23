import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SW, height: SH } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 8 }]}>

      {/* ── Background decorations ──────────────────────────────────────── */}
      <View style={styles.decoTop} pointerEvents="none">
        <MaterialIcons name="cloud" size={48} color="#3b4d06" style={{ opacity: 0.4 }} />
        <MaterialIcons name="star" size={36} color="#3b4d06" style={{ opacity: 0.4, marginTop: 44, marginRight: 16 }} />
      </View>

      {/* Bottom semicircle blobs */}
      <View style={styles.decoBottom} pointerEvents="none">
        <View style={styles.blobLeft} />
        <View style={styles.blobRight} />
      </View>

      {/* ── Center: Logo ───────────────────────────── */}
      <View style={styles.centerSection}>
        <Image
          source={require('../assets/images/materials/Logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* ── Bottom: Actions ─────────────────────────────────────────────── */}
      <View style={styles.bottomSection}>
        {/* Primary CTA */}
        <Pressable
          style={({ pressed }) => [styles.ctaWrap, pressed && { opacity: 0.85 }]}
          onPress={() => router.push('/onboarding')}
        >
          <LinearGradient
            colors={['#6b8227', '#88a536']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaBtn}
          >
            <Text style={styles.ctaText}>Mulai Petualangan</Text>
            <MaterialIcons name="arrow-forward" size={24} color="white" />
          </LinearGradient>
        </Pressable>

        {/* Secondary login link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginHint}>Sudah punya karakter?</Text>
          <Pressable onPress={() => router.push('/home')}>
            <Text style={styles.loginLink}>Masuk Akun</Text>
          </Pressable>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ABC270',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  // ── Background decorations ─────────────────────────────────────────────
  decoTop: {
    position: 'absolute',
    top: 32,
    left: 24,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  decoBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 130,
    overflow: 'hidden',
    opacity: 0.2,
  },
  blobLeft: {
    position: 'absolute',
    bottom: -50,
    left: -30,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: '#6b8227',
  },
  blobRight: {
    position: 'absolute',
    bottom: -100,
    right: -30,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#52651E',
  },

  // ── Center section ─────────────────────────────────────────────────────
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    width: '100%',
    paddingHorizontal: 40,
  },
  logoImage: {
    width: '100%',
    height: 300,
  },


  // ── Bottom section ─────────────────────────────────────────────────────
  bottomSection: {
    width: '100%',
    paddingHorizontal: 32,
    gap: 20,
    zIndex: 10,
    marginBottom: 12,
  },
  ctaWrap: {
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#52651E',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  ctaBtn: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 999,
  },
  ctaText: {
    color: 'white',
    fontSize: 21,
    fontWeight: '800',
  },
  loginRow: {
    alignItems: 'center',
    gap: 4,
    paddingBottom: 4,
  },
  loginHint: {
    fontSize: 16,
    color: 'rgba(59,77,6,0.7)',
    fontWeight: '500',
  },
  loginLink: {
    fontSize: 19,
    fontWeight: '800',
    color: '#3b4d06',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
});
