import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Colour tokens matching the web version ──────────────────────────────────
const C = {
  bg: '#ABC270',
  primary: '#52651E',
  primaryContainer: '#D4E8A0',
  secondary: '#5E6644',
  secondaryContainer: '#E3E9C6',
  tertiary: '#3B6659',
  tertiaryContainer: '#BDEBD7',
  surface: '#FAFAF3',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F4F5EE',
  surfaceContainerHigh: '#E3E4DC',
  surfaceContainerHighest: '#DDDEDA',
  onSurface: '#1B1C18',
  onSurfaceVariant: '#44483D',
  onPrimary: '#FFFFFF',
  white90: 'rgba(255,255,255,0.90)',
};

// ── SVG Circular Progress ───────────────────────────────────────────────────
function CircularProgress({ size = 80, strokeWidth = 8, fill = 65 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (fill / 100) * circumference;
  const center = size / 2;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={C.surfaceContainerHigh}
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={C.secondary}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={styles.circleLabel}>{fill}%</Text>
    </View>
  );
}

// ── Progress Bar Row ────────────────────────────────────────────────────────
function SilaBar({ label, pct }) {
  return (
    <View style={styles.silaRow}>
      <View style={styles.silaLabelRow}>
        <Text style={styles.silaLabel}>{label}</Text>
        <Text style={styles.silaPct}>{pct}%</Text>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}

// ── Bottom Nav Item ─────────────────────────────────────────────────────────
function NavItem({ icon, label, active = false, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.navItem,
        active && styles.navItemActive,
        pressed && !active && styles.navItemPressed,
      ]}
    >
      <MaterialIcons
        name={icon}
        size={24}
        color={active ? C.onSurface : C.secondary + '99'}
      />
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </Pressable>
  );
}

// ── Main Screen ─────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.push('/onboarding')}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByiFa9FqNjUiekBPiMxEo06K6KQQWZPOAE5fHKj4pq8lndiIini3kgzldOUBkvdyRWFAiDf-s6tZCQfMJyqEelR2goR7Nju-QmT8vM06PjFeiLP2iYB0tQQT0LGLUak1cSPFSIjuLRi-qT81Yc8BiG3imqYdupv2zc19mGcnHHBFF1HDeHierTpDqyHkw0cYJ9VA2aqmqvI5i9iecZXspT7M4FgudnLSJY94qNL5yRX-jnK6gf0bnnpFNhwZo6IWM3KhRdmPSr0NM',
              }}
              style={styles.avatar}
            />
          </Pressable>
          <Text style={styles.greeting}>Pagi Petualang!</Text>
        </View>

        <View style={styles.pointsBadge}>
          <MaterialIcons name="stars" size={16} color={C.secondary} />
          <Text style={styles.pointsText}>1,250 Pts</Text>
        </View>
      </View>

      {/* ── SCROLLABLE CONTENT ──────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 120 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Quiz Card ─────────────────────────────────────────────────── */}
        <View style={styles.quizCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.quizCardLabel}>QUIZ TERBARU KAMU</Text>
            <Text style={styles.quizCardTitle}>{'Ayo Kenal\nPancasila!'}</Text>
          </View>
          <CircularProgress size={80} strokeWidth={8} fill={65} />
        </View>

        {/* ── Bot Card ──────────────────────────────────────────────────── */}
        <View style={styles.botCard}>
          {/* decorative blobs */}
          <View style={styles.blobTL} />
          <View style={styles.blobBR} />

          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbo7LcxIWuFnw-gNiTYSezp2-SOPrwlXCwWklGnRz1ySMrP8EsXU8MKVTcJgCOTkSJnlluDG2OrLc7VkwdimHtf5HlQh-9RWSET6Zgr95c0eKEhdLZnPMoOTbJpke-dgvFEWkoJJWbe67Izf22sa5t5MgVjCF07hZv_Dj0LXHLAUR6FbdIa7XcqV9FWK5ku0mxBGD6EGCehLyxfiChO21Bq2Mdgz3zx7zapWWiXbYevSIcYR6p9pSMtnnqiruc-5CFWFbBFfHwsGs',
            }}
            style={styles.botImage}
            resizeMode="contain"
          />

          <View style={styles.botInfoBar}>
            <View>
              <Text style={styles.botName}>Panca-Bot</Text>
              <Text style={styles.botLevel}>Level 12 Explorer</Text>
            </View>
            <Pressable style={styles.refreshBtn}>
              <MaterialIcons name="refresh" size={22} color="white" />
            </Pressable>
          </View>
        </View>

        {/* ── Action Buttons ────────────────────────────────────────────── */}
        <View style={styles.actionRow}>
          <Pressable
            style={({ pressed }) => [styles.actionBtnWrap, pressed && { opacity: 0.85 }]}
            onPress={() => router.push('/quiz')}
          >
            <LinearGradient
              colors={[C.primary, '#3A4F10']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionBtn}
            >
              <MaterialIcons name="play-circle" size={26} color="white" />
              <Text style={styles.actionBtnText}>Mulai Quiz</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.actionBtnWrap, pressed && { opacity: 0.85 }]}
          >
            <View style={[styles.actionBtn, { backgroundColor: C.secondary }]}>
              <MaterialIcons name="map" size={26} color="white" />
              <Text style={styles.actionBtnText}>Petualangan</Text>
            </View>
          </Pressable>
        </View>

        {/* ── Pemahaman Sila ────────────────────────────────────────────── */}
        <View style={styles.progressBox}>
          <View style={styles.progressHeader}>
            <MaterialIcons name="shield" size={18} color={C.primary} />
            <Text style={styles.progressTitle}>Pemahaman Sila</Text>
          </View>
          <SilaBar label="Sila 1: Ketuhanan" pct={80} />
          <SilaBar label="Sila 2: Kemanusiaan" pct={45} />
          <SilaBar label="Sila 3: Persatuan" pct={90} />
          <SilaBar label="Sila 4: Kerakyatan" pct={30} />
          <SilaBar label="Sila 5: Keadilan" pct={60} />
        </View>

        {/* ── Petualanganmu ─────────────────────────────────────────────── */}
        <View style={styles.adventureSection}>
          <View style={styles.adventureHeader}>
            <Text style={styles.adventureTitle}>Petualanganmu</Text>
            <Pressable>
              <Text style={styles.lihatSemua}>Lihat Semua</Text>
            </Pressable>
          </View>

          {/* Unlocked item */}
          <Pressable style={styles.adventureItem}>
            <View style={[styles.adventureIcon, { backgroundColor: C.tertiaryContainer }]}>
              <MaterialIcons name="forest" size={24} color={C.tertiary} />
            </View>
            <View style={styles.adventureInfo}>
              <Text style={styles.adventureItemTitle}>Hutan Musyawarah</Text>
              <Text style={styles.adventureItemSub}>Level 4 • Sila ke-4</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={C.primary} />
          </Pressable>

          {/* Locked item */}
          <View style={[styles.adventureItem, styles.adventureItemLocked]}>
            <View style={[styles.adventureIcon, { backgroundColor: C.surfaceContainerHighest }]}>
              <MaterialIcons name="lock" size={24} color={C.onSurfaceVariant} />
            </View>
            <View style={styles.adventureInfo}>
              <Text style={styles.adventureItemTitle}>Lembah Gotong Royong</Text>
              <Text style={styles.adventureItemSub}>Terkunci • Butuh Level 15</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── BOTTOM NAV ──────────────────────────────────────────────────── */}
      <View style={[styles.navbar, { paddingBottom: insets.bottom + 8 }]}>
        <NavItem icon="home" label="Home" active onPress={() => router.push('/home')} />
        <NavItem icon="extension" label="Quiz" onPress={() => router.push('/quiz')} />
        <NavItem icon="face" label="Karakter" />
        <NavItem icon="map" label="Misi" />
        <NavItem icon="person" label="Profil" onPress={() => router.push('/onboarding')} />
      </View>
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: C.white90,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: C.primary,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: -0.3,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.secondaryContainer,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  pointsText: {
    fontWeight: '800',
    fontSize: 13,
    color: C.onSurface,
  },

  // SCROLL
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },

  // QUIZ CARD
  quizCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  quizCardLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: C.onSurfaceVariant,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  quizCardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: C.onSurface,
    marginTop: 6,
    lineHeight: 26,
  },
  circleLabel: {
    position: 'absolute',
    fontWeight: '900',
    fontSize: 13,
    color: C.onSurface,
  },

  // BOT CARD
  botCard: {
    backgroundColor: C.primaryContainer,
    borderRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  blobTL: {
    position: 'absolute',
    top: 30,
    left: 30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: C.primary + '18',
  },
  blobBR: {
    position: 'absolute',
    bottom: 60,
    right: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: C.tertiary + '18',
  },
  botImage: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.6,
    maxWidth: 280,
    maxHeight: 280,
  },
  botInfoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: C.white90,
    padding: 14,
    borderRadius: 16,
    marginTop: 10,
  },
  botName: {
    fontWeight: '900',
    fontSize: 17,
    color: C.onSurface,
  },
  botLevel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  refreshBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.primary,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },

  // ACTION BUTTONS
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtnWrap: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  actionBtn: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flexDirection: 'column',
  },
  actionBtnText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 13,
  },

  // PROGRESS
  progressBox: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 20,
    padding: 18,
    gap: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  progressTitle: {
    fontWeight: '800',
    fontSize: 13,
    color: C.onSurfaceVariant,
  },
  silaRow: {
    gap: 4,
  },
  silaLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  silaLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: C.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  silaPct: {
    fontSize: 10,
    fontWeight: '800',
    color: C.primary,
  },
  barBg: {
    height: 8,
    backgroundColor: C.surfaceContainerHighest,
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    backgroundColor: C.primary,
    borderRadius: 10,
  },

  // ADVENTURE
  adventureSection: {
    gap: 12,
  },
  adventureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adventureTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: C.onSurface,
  },
  lihatSemua: {
    fontSize: 13,
    fontWeight: '700',
    color: C.primary,
  },
  adventureItem: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  adventureItemLocked: {
    opacity: 0.6,
  },
  adventureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adventureInfo: {
    flex: 1,
  },
  adventureItemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: C.onSurface,
  },
  adventureItemSub: {
    fontSize: 11,
    color: C.onSurfaceVariant,
    marginTop: 2,
  },

  // NAVBAR
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    backgroundColor: C.white90,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 2,
  },
  navItemActive: {
    backgroundColor: C.bg,
  },
  navItemPressed: {
    backgroundColor: C.bg + '40',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.secondary + '99',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  navLabelActive: {
    color: C.onSurface,
  },
});