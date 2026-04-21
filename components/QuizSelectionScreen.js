import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ── Colour tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#FAFAF3',
  primary: '#52651E',
  primaryContainer: '#D4E8A0',
  onPrimaryContainer: '#161E00',
  secondary: '#5E6644',
  secondaryContainer: '#E3E9C6',
  tertiary: '#3B6659',
  tertiaryContainer: '#BDEBD7',
  onTertiary: '#FFFFFF',
  surface: '#FAFAF3',
  surfaceContainerLowest: '#FFFFFF',
  onSurface: '#1B1C18',
  onSurfaceVariant: '#44483D',
  navBg: 'rgba(255,255,255,0.92)',
  accent: '#ABC270',
};

// ── Star rating row ──────────────────────────────────────────────────────────
function StarRow({ filled = 0 }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3].map((i) => (
        <MaterialIcons
          key={i}
          name="star"
          size={14}
          color={i <= filled ? C.tertiary : '#D1D5DB'}
        />
      ))}
    </View>
  );
}

// ── Single quiz card ─────────────────────────────────────────────────────────
function QuizCard({ icon, iconBg, iconColor, title, points, stars, level, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.quizCard, pressed && { opacity: 0.82, transform: [{ scale: 0.97 }] }]}
      onPress={onPress}
    >
      <View style={[styles.quizIconWrap, { backgroundColor: iconBg }]}>
        <MaterialIcons name={icon} size={30} color={iconColor} />
      </View>
      <View style={styles.quizCardBody}>
        <View style={styles.quizCardTopRow}>
          <Text style={styles.quizCardTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.quizCardPts}>{points}</Text>
        </View>
        <StarRow filled={stars} />
        <Text style={styles.quizCardLevel}>{level}</Text>
      </View>
    </Pressable>
  );
}

// ── Nav item ─────────────────────────────────────────────────────────────────
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
        color={active ? C.onSurface : C.primary + '99'}
      />
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </Pressable>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────────
export default function QuizSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const goToQuestion = () => router.push('/quiz/question');

  return (
    <View style={styles.container}>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={styles.headerApp}>PancaGo!</Text>
          <Text style={styles.headerTitle}>Pilih Kuis Kamu</Text>
        </View>
        <View style={styles.pointsBadge}>
          <MaterialIcons name="stars" size={20} color={C.primary} />
          <Text style={styles.pointsText}>1,250 Pts</Text>
        </View>
      </View>

      {/* ── SCROLLABLE CONTENT ────────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 110 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >

        {/* Hero banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroBannerText}>
            <Text style={styles.heroBannerTitle}>Siap berpetualang{'\n'}hari ini?</Text>
            <Text style={styles.heroBannerSub}>
              Pilih misi belajarmu dan kumpulkan poin persahabatan!
            </Text>
          </View>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKKjO1Gi4wCwkEPtwOHnjrhZx26Ooz4crpeGaphXyTb71XEuM3-duEGCOsdtl-zFbAEvDnR3rEoaVcEO9aP4ZO8C9EJl_rxJ9VdmIIyZKaEawsCg9wF_ADkzThKRn_7WesRY7yozRD1ciuL3sW5xXj4kTvZoEspNMZFCMC-Ca7HlygWLryZW9qp-qoFdV1EvgaS32vvgnjWvcU4yKXKQ55rkwmHbX72k1P97YG_yIrHo1FSwpA42iNOdvzeRCQLxoJPVHsJm6IIDU',
            }}
            style={styles.heroBannerImg}
            resizeMode="contain"
          />
        </View>

        {/* Quiz cards */}
        <View style={styles.cardList}>
          <QuizCard
            icon="extension"
            iconBg={C.secondaryContainer}
            iconColor={C.secondary}
            title="Ayo Kenal Pancasila!"
            points="+50 Pts"
            stars={1}
            level="Tingkat: Pemula"
            onPress={goToQuestion}
          />
          <QuizCard
            icon="favorite"
            iconBg={C.tertiaryContainer}
            iconColor={C.tertiary}
            title="Pilih yang Baik Yuk!"
            points="+100 Pts"
            stars={2}
            level="Tingkat: Menengah"
            onPress={goToQuestion}
          />
          <QuizCard
            icon="map"
            iconBg={C.primaryContainer}
            iconColor={C.primary}
            title="Misi Kebaikan Hari Ini!"
            points="+250 Pts"
            stars={3}
            level="Tingkat: Petualang"
            onPress={goToQuestion}
          />
        </View>

        {/* Weekly event banner */}
        <View style={styles.eventBanner}>
          <View style={styles.eventBannerDecor} />
          <View style={styles.eventBannerContent}>
            <View>
              <Text style={styles.eventTitle}>Event Mingguan</Text>
              <Text style={styles.eventSub}>
                Selesaikan 5 kuis untuk lencana 'Pahlawan Cilik'!
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [styles.eventBtn, pressed && { opacity: 0.85 }]}
              onPress={goToQuestion}
            >
              <Text style={styles.eventBtnText}>Ikuti Sekarang</Text>
            </Pressable>
          </View>
        </View>

      </ScrollView>

      {/* ── BOTTOM NAV ────────────────────────────────────────────────────── */}
      <View style={[styles.navbar, { paddingBottom: insets.bottom + 8 }]}>
        <NavItem icon="home"      label="Home"     onPress={() => router.push('/home')} />
        <NavItem icon="extension" label="Quiz"     active />
        <NavItem icon="face"      label="Karakter" />
        <NavItem icon="map"       label="Misi" />
        <NavItem icon="person"    label="Profil"   onPress={() => router.push('/onboarding')} />
      </View>

    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
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
    paddingHorizontal: 24,
    paddingBottom: 14,
    backgroundColor: 'rgba(250,250,243,0.92)',
    zIndex: 40,
  },
  headerApp: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: C.onSurfaceVariant,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: -0.3,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.primaryContainer,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pointsText: {
    fontWeight: '800',
    fontSize: 13,
    color: C.onPrimaryContainer,
  },

  // SCROLL
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },

  // HERO BANNER
  heroBanner: {
    backgroundColor: C.primaryContainer,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroBannerText: {
    flex: 1,
    zIndex: 10,
  },
  heroBannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.onPrimaryContainer,
    lineHeight: 24,
  },
  heroBannerSub: {
    fontSize: 11,
    color: C.onPrimaryContainer,
    opacity: 0.75,
    marginTop: 6,
    lineHeight: 16,
  },
  heroBannerImg: {
    width: 110,
    height: 110,
    marginRight: -8,
    marginBottom: -8,
  },

  // QUIZ CARD LIST
  cardList: {
    gap: 12,
  },
  quizCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  quizIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  quizCardBody: {
    flex: 1,
    minWidth: 0,
  },
  quizCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  quizCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: C.onSurface,
    flex: 1,
  },
  quizCardPts: {
    fontSize: 11,
    fontWeight: '800',
    color: C.primary,
    marginLeft: 8,
    flexShrink: 0,
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
  },
  quizCardLevel: {
    fontSize: 9,
    fontWeight: '800',
    color: C.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: 6,
  },

  // EVENT BANNER
  eventBanner: {
    backgroundColor: C.secondary,
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
  },
  eventBannerDecor: {
    position: 'absolute',
    right: -32,
    bottom: -32,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  eventBannerContent: {
    gap: 14,
    zIndex: 10,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  eventSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    lineHeight: 16,
  },
  eventBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 22,
    alignSelf: 'flex-start',
  },
  eventBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: C.secondary,
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
    backgroundColor: C.navBg,
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
    backgroundColor: '#ABC270',
  },
  navItemPressed: {
    backgroundColor: '#ABC27040',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.primary + '99',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  navLabelActive: {
    color: C.onSurface,
  },
});
