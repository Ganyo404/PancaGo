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

      {/* ── Top: Logo area ──────────────────────────────────────────────── */}
      <View style={styles.topSection}>
        <View style={styles.iconBadge}>
          <MaterialIcons name="explore" size={32} color="#3b4d06" />
        </View>
        <Text style={styles.title}>PancaGo!</Text>
        <Text style={styles.subtitle}>PETUALANGAN LITERASI SERU</Text>
      </View>

      {/* ── Center: Mascot + Floating badges ───────────────────────────── */}
      <View style={styles.centerSection}>
        {/* Mascot image */}
        <View style={styles.mascotWrapper}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpzR0eWeAINaz3RmohS4EcGDWLzujY8sYkftqqpctKfY3vEGKc4P0J8ZDo3TYjhiwc8z4NT1I8WXpktscqVeTJJg34WvnAk0Bup9myu46mob4Nbak-JXOOiyZhGRq3lvQAvr7XGxYQlQo4M5XRK1dHGjSAIYoP-OtkRJUpen6GnCPcXVk0ko59y900TSfeB1dd7kLdUbLqBrLP85TkQEOoTx9RRu7yjcaMasyB-37P5tJ1PWdyfdb-ftZfjP8Kr97Dsva0xiP-UZk',
            }}
            style={styles.mascotImage}
            resizeMode="cover"
          />
        </View>

        {/* Floating badge — top right */}
        <View style={styles.floatRight}>
          <MaterialIcons name="extension" size={28} color="#574500" />
        </View>

        {/* Floating badge — bottom left */}
        <View style={styles.floatLeft}>
          <MaterialIcons name="map" size={28} color="#564334" />
        </View>
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

  // ── Top section ────────────────────────────────────────────────────────
  topSection: {
    alignItems: 'center',
    marginTop: 80,
    zIndex: 10,
  },
  iconBadge: {
    backgroundColor: '#9eb461',
    padding: 14,
    borderRadius: 999,
    marginBottom: 12,
    shadowColor: '#3b4d06',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    color: '#3b4d06',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3b4d06',
    letterSpacing: 2,
    opacity: 0.75,
    marginTop: 4,
  },

  // ── Center section ─────────────────────────────────────────────────────
  centerSection: {
    width: 260,
    height: 260,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  mascotWrapper: {
    width: 260,
    height: 260,
    borderRadius: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    backgroundColor: '#4b89c8', // blue fallback while image loads
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  },
  floatRight: {
    position: 'absolute',
    top: -20,
    right: -28,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFE087',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 20,
  },
  floatLeft: {
    position: 'absolute',
    bottom: -18,
    left: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F9DDC8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 20,
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
    fontSize: 18,
    fontWeight: '800',
  },
  loginRow: {
    alignItems: 'center',
    gap: 4,
    paddingBottom: 4,
  },
  loginHint: {
    fontSize: 13,
    color: 'rgba(59,77,6,0.7)',
    fontWeight: '500',
  },
  loginLink: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3b4d06',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
});
