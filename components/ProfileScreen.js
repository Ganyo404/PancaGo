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
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Colour tokens (same as HomeScreen) ─────────────────────────────────────
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
  cardBg: 'rgba(255,255,255,0.60)',
};

// ── Circular progress (for Sila completion) ─────────────────────────────────
function CircularProgress({ size = 72, strokeWidth = 7, fill = 60 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (fill / 100) * circumference;
  const center = size / 2;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={center} cy={center} r={radius}
          fill="transparent" stroke={C.surfaceContainerHigh} strokeWidth={strokeWidth}
        />
        <Circle
          cx={center} cy={center} r={radius}
          fill="transparent" stroke={C.primary} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={styles.circleLabel}>{fill}%</Text>
    </View>
  );
}

// ── Sila step icon ──────────────────────────────────────────────────────────
function SilaStep({ done, locked }) {
  if (done) {
    return (
      <View style={[styles.silaStep, { backgroundColor: C.primary }]}>
        <MaterialIcons name="check" size={16} color="#fff" />
      </View>
    );
  }
  return (
    <View style={[styles.silaStep, { backgroundColor: C.surfaceContainerHigh }]}>
      <MaterialIcons name="lock" size={14} color={C.onSurfaceVariant} />
    </View>
  );
}

// ── Badge card ──────────────────────────────────────────────────────────────
function BadgeCard({ iconName, iconBg, iconColor, title, desc, locked = false }) {
  return (
    <View style={[styles.badgeCard, locked && styles.badgeCardLocked]}>
      <View style={[styles.badgeIconWrap, { backgroundColor: iconBg }]}>
        <MaterialIcons name={iconName} size={26} color={iconColor} />
      </View>
      <Text style={[styles.badgeTitle, locked && { color: C.onSurfaceVariant }]}>{title}</Text>
      <Text style={styles.badgeDesc}>{desc}</Text>
    </View>
  );
}

// ── Bottom nav item ─────────────────────────────────────────────────────────
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
      <MaterialIcons name={icon} size={24} color={active ? C.onSurface : C.secondary + '99'} />
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </Pressable>
  );
}

// ── Main ProfileScreen ──────────────────────────────────────────────────────
export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const silaCompleted = [true, true, true, false, false]; // 3 out of 5

  return (
    <View style={styles.container}>
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="person" size={20} color={C.primary} />
          <Text style={styles.headerTitle}>Profil Petualang</Text>
        </View>
        <View style={styles.pointsBadge}>
          <MaterialIcons name="stars" size={16} color={C.secondary} />
          <Text style={styles.pointsText}>1,250 Pts</Text>
        </View>
      </View>

      {/* ── SCROLLABLE CONTENT ──────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Avatar & Name ─────────────────────────────────────────────── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByiFa9FqNjUiekBPiMxEo06K6KQQWZPOAE5fHKj4pq8lndiIini3kgzldOUBkvdyRWFAiDf-s6tZCQfMJyqEelR2goR7Nju-QmT8vM06PjFeiLP2iYB0tQQT0LGLUak1cSPFSIjuLRi-qT81Yc8BiG3imqYdupv2zc19mGcnHHBFF1HDeHierTpDqyHkw0cYJ9VA2aqmqvI5i9iecZXspT7M4FgudnLSJY94qNL5yRX-jnK6gf0bnnpFNhwZo6IWM3KhRdmPSr0NM',
              }}
              style={styles.avatar}
            />
            <Pressable style={styles.editBadge}>
              <MaterialIcons name="edit" size={12} color="#fff" />
            </Pressable>
          </View>
          <Text style={styles.userName}>Ovelia</Text>
          <Text style={styles.userLevel}>Petualang Tingkat 4</Text>
        </View>

        {/* ── Sila Progress Card ─────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.silaHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Sila Selesai: 3/5</Text>
              <Text style={styles.cardSub}>Hampir jadi Penjaga Pancasila!</Text>
            </View>
            <CircularProgress size={72} strokeWidth={7} fill={60} />
          </View>
          {/* Sila step indicators */}
          <View style={styles.silaSteps}>
            {silaCompleted.map((done, i) => (
              <SilaStep key={i} done={done} locked={!done} />
            ))}
          </View>
        </View>

        {/* ── Lencana Kehormatan ─────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lencana Kehormatan</Text>
          <Pressable>
            <Text style={styles.lihatSemua}>LIHAT SEMUA</Text>
          </Pressable>
        </View>

        <View style={styles.badgeGrid}>
          <BadgeCard
            iconName="shield"
            iconBg="#FFF3C4"
            iconColor="#C97D10"
            title="Pahlawan Cilik"
            desc="Selesaikan Sila 1"
          />
          <BadgeCard
            iconName="group"
            iconBg="#FFE3DF"
            iconColor="#B55C4E"
            title="Sahabat Budi"
            desc="Bantu 5 Teman"
          />
          <BadgeCard
            iconName="map"
            iconBg={C.primaryContainer}
            iconColor={C.primary}
            title="Penjelajah"
            desc="Buka 3 Lokasi"
          />
          <BadgeCard
            iconName="military-tech"
            iconBg={C.surfaceContainerHigh}
            iconColor={C.onSurfaceVariant}
            title="???"
            desc="Belum Terbuka"
            locked
          />
        </View>

        {/* ── Rank & Streak Row ─────────────────────────────────────────── */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>RANK GLOBAL</Text>
            <Text style={styles.statValue}>#42</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: C.secondary }]}>
            <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.75)' }]}>BERUNTUN</Text>
            <View style={styles.streakRow}>
              <Text style={[styles.statValue, { color: '#fff' }]}>12</Text>
              <MaterialIcons name="local-fire-department" size={20} color="#FFA040" />
            </View>
          </View>
        </View>

        {/* ── Daily Quest Card ──────────────────────────────────────────── */}
        <Pressable style={styles.questCard}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKKjO1Gi4wCwkEPtwOHnjrhZx26Ooz4crpeGaphXyTb71XEuM3-duEGCOsdtl-zFbAEvDnR3rEoaVcEO9aP4ZO8C9EJl_rxJ9VdmIIyZKaEawsCg9wF_ADkzThKRn_7WesRY7yozRD1ciuL3sW5xXj4kTvZoEspNMZFCMC-Ca7HlygWLryZW9qp-qoFdV1EvgaS32vvgnjWvcU4yKXKQ55rkwmHbX72k1P97YG_yIrHo1FSwpA42iNOdvzeRCQLxoJPVHsJm6IIDU',
            }}
            style={styles.questImg}
            resizeMode="contain"
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.questTitle}>Kuis Harian</Text>
            <Text style={styles.questSub}>Selesaikan tantangan hari ini</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={C.primary} />
        </Pressable>
      </ScrollView>

      {/* ── BOTTOM NAV ──────────────────────────────────────────────────── */}
      <View style={[styles.navbar, { paddingBottom: insets.bottom + 8 }]}>
        <NavItem icon="home" label="Home" onPress={() => router.push('/home')} />
        <NavItem icon="extension" label="Quiz" onPress={() => router.push('/quiz')} />
        <NavItem icon="face" label="Karakter" />
        <NavItem icon="map" label="Misi" />
        <NavItem icon="person" label="Profil" active />
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
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
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
    paddingTop: 24,
    gap: 16,
  },

  // AVATAR SECTION
  avatarSection: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: C.white90,
  },
  editBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '900',
    color: C.onSurface,
    letterSpacing: -0.3,
  },
  userLevel: {
    fontSize: 13,
    fontWeight: '700',
    color: C.primary,
  },

  // CARD (general white card)
  card: {
    backgroundColor: C.cardBg,
    borderRadius: 20,
    padding: 18,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  silaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: C.onSurface,
  },
  cardSub: {
    fontSize: 11,
    color: C.onSurfaceVariant,
    marginTop: 4,
    lineHeight: 16,
  },
  circleLabel: {
    position: 'absolute',
    fontWeight: '900',
    fontSize: 13,
    color: C.onSurface,
  },
  silaSteps: {
    flexDirection: 'row',
    gap: 10,
  },
  silaStep: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // SECTION HEADER
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: C.onSurface,
  },
  lihatSemua: {
    fontSize: 10,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: 1,
  },

  // BADGE GRID (2 columns)
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    backgroundColor: C.cardBg,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    width: (SCREEN_WIDTH - 40 - 12) / 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  badgeCardLocked: {
    opacity: 0.65,
    borderStyle: 'dashed',
  },
  badgeIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: C.onSurface,
    textAlign: 'center',
  },
  badgeDesc: {
    fontSize: 10,
    color: C.onSurfaceVariant,
    textAlign: 'center',
  },

  // STATS ROW
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: C.cardBg,
    borderRadius: 16,
    padding: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: C.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: C.onSurface,
    letterSpacing: -1,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // DAILY QUEST CARD
  questCard: {
    backgroundColor: C.cardBg,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  questImg: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  questTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: C.onSurface,
  },
  questSub: {
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
