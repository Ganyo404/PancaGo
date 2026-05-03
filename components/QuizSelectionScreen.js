import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgressStore } from '../store/useProgressStore';
import { useQuizStore } from '../store/useQuizStore';
import { useUserStore } from '../store/useUserStore';

const C = {
  bg: '#FAFAF3', primary: '#52651E', primaryContainer: '#D4E8A0',
  onPrimaryContainer: '#161E00', secondary: '#5E6644', secondaryContainer: '#E3E9C6',
  tertiary: '#3B6659', surface: '#FFFFFF',
  onSurface: '#1B1C18', onSurfaceVariant: '#44483D',
  navBg: 'rgba(255,255,255,0.92)', accent: '#ABC270',
};

const SILAS = [
  { num: 1, name: 'SILA 1 : KETUHANAN YANG MAHA ESA',                                          logo: require('../assets/images/logopancasila/sila1.png'), heroBg: '#FDDECF' },
  { num: 2, name: 'SILA 2 : KEMANUSIAAN YANG ADIL DAN BERADAB',                                logo: require('../assets/images/logopancasila/sila2.png'), heroBg: '#FFF9C4' },
  { num: 3, name: 'SILA 3 : PERSATUAN INDONESIA',                                               logo: require('../assets/images/logopancasila/sila3.png'), heroBg: '#BDEBD7' },
  { num: 4, name: 'SILA 4 : KERAKYATAN YANG DIPIMPIN OLEH HIKMAT KEBIJAKSANAAN DALAM PERMUSYAWARATAN/PERWAKILAN', logo: require('../assets/images/logopancasila/sila4.png'), heroBg: '#D4E8A0' },
  { num: 5, name: 'SILA 5 : KEADILAN SOSIAL BAGI SELURUH RAKYAT INDONESIA',                    logo: require('../assets/images/logopancasila/sila5.jpg'), heroBg: '#E3E9C6' },
];

function NavItem({ icon, label, active = false, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        st.navItem,
        active && st.navItemActive,
        pressed && !active && st.navItemPressed,
      ]}
    >
      <MaterialIcons name={icon} size={24} color={active ? C.onSurface : C.primary + '99'} />
      <Text style={[st.navLabel, active && st.navLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function SilaCard({ sila, doneCount, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        st.silaCard,
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
      ]}
      onPress={onPress}
    >
      <View style={[st.silaLogoWrap, { backgroundColor: sila.heroBg }]}>
        <Image source={sila.logo} style={st.silaLogo} resizeMode="contain" />
      </View>
      <Text style={st.silaName} numberOfLines={3}>{sila.name}</Text>
      <View style={st.silaProgress}>
        <MaterialIcons name="check-circle" size={14} color={doneCount > 0 ? C.primary : C.onSurfaceVariant + '55'} />
        <Text style={st.silaProgressText}>{doneCount}/9</Text>
      </View>
      <MaterialIcons name="chevron-right" size={22} color={C.onSurfaceVariant + '80'} />
    </Pressable>
  );
}

export default function QuizSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { points } = useUserStore();
  const completedQuizIds = useProgressStore((s) => s.completedQuizIds);
  const { loadQuizzesBySila } = useQuizStore();

  // Preload semua sila agar count progress akurat
  useEffect(() => {
    [1, 2, 3, 4, 5].forEach(n => loadQuizzesBySila(n));
  }, []);

  return (
    <View style={st.container}>
      {/* HEADER */}
      <View style={[st.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={st.headerApp}>PANCAGO!</Text>
          <Text style={st.headerTitle}>Pilih Kuis Kamu</Text>
        </View>
        <View style={st.pointsBadge}>
          <MaterialIcons name="stars" size={20} color={C.primary} />
          <Text style={st.pointsText}>{points.toLocaleString('id-ID')} Pts</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[st.scroll, { paddingBottom: 110 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero banner */}
        <View style={st.heroBanner}>
          <View style={st.heroBannerText}>
            <Text style={st.heroBannerTitle}>Siap berpetualang{'\n'}hari ini?</Text>
            <Text style={st.heroBannerSub}>Pilih misi belajarmu dan kumpulkan poin persahabatan!</Text>
          </View>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKKjO1Gi4wCwkEPtwOHnjrhZx26Ooz4crpeGaphXyTb71XEuM3-duEGCOsdtl-zFbAEvDnR3rEoaVcEO9aP4ZO8C9EJl_rxJ9VdmIIyZKaEawsCg9wF_ADkzThKRn_7WesRY7yozRD1ciuL3sW5xXj4kTvZoEspNMZFCMC-Ca7HlygWLryZW9qp-qoFdV1EvgaS32vvgnjWvcU4yKXKQ55rkwmHbX72k1P97YG_yIrHo1FSwpA42iNOdvzeRCQLxoJPVHsJm6IIDU' }}
            style={st.heroBannerImg} resizeMode="contain"
          />
        </View>

        {/* Sila cards */}
        <View style={st.cardList}>
          {SILAS.map((sila) => {
            // Hitung doneCount langsung dari completedQuizIds berdasarkan pola ID
            // Format: quiz-sila{n}-{difficulty}-{order} — tidak perlu tunggu fetch Supabase
            const doneCount = completedQuizIds.filter(
              id => id.startsWith(`quiz-sila${sila.num}-`)
            ).length;
            return (
              <SilaCard
                key={sila.num}
                sila={sila}
                doneCount={doneCount}
                onPress={() => router.push(`/quiz/sila?silaNum=${sila.num}`)}
              />
            );
          })}
        </View>

        {/* Event banner */}
        <View style={st.eventBanner}>
          <View style={st.eventDecor} />
          <View style={st.eventContent}>
            <View>
              <Text style={st.eventTitle}>Event Mingguan</Text>
              <Text style={st.eventSub}>Selesaikan 5 kuis untuk lencana 'Pahlawan Cilik'!</Text>
            </View>
            <Pressable style={({ pressed }) => [st.eventBtn, pressed && { opacity: 0.85 }]}>
              <Text style={st.eventBtnText}>Ikuti Sekarang</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={[st.navbar, { paddingBottom: insets.bottom + 8 }]}>
        <NavItem icon="home"      label="Home"     onPress={() => router.push('/home')} />
        <NavItem icon="extension" label="Quiz"     active />
        <NavItem icon="face"      label="Karakter" onPress={() => router.push('/karakter')} />
        <NavItem icon="map"       label="Misi"     onPress={() => router.push('/misi')} />
        <NavItem icon="person"    label="Profil"   onPress={() => router.push('/profil')} />
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingBottom: 14, backgroundColor: 'rgba(250,250,243,0.95)', zIndex: 40,
  },
  headerApp: { fontSize: 12, fontWeight: '800', letterSpacing: 2, color: C.onSurfaceVariant, textTransform: 'uppercase', marginBottom: 2 },
  headerTitle: { fontSize: 27, fontWeight: '900', color: C.primary, letterSpacing: -0.3 },
  pointsBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.primaryContainer, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  pointsText: { fontWeight: '800', fontSize: 16, color: C.onPrimaryContainer },

  scroll: { paddingHorizontal: 20, paddingTop: 20, gap: 16 },

  heroBanner: { backgroundColor: C.primaryContainer, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  heroBannerText: { flex: 1 },
  heroBannerTitle: { fontSize: 21, fontWeight: '800', color: C.onPrimaryContainer, lineHeight: 24 },
  heroBannerSub: { fontSize: 13, color: C.onPrimaryContainer, opacity: 0.75, marginTop: 6, lineHeight: 16 },
  heroBannerImg: { width: 100, height: 100, marginRight: -8, marginBottom: -8 },

  cardList: { gap: 10 },
  silaCard: {
    backgroundColor: C.surface, borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
  },
  silaLogoWrap: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  silaLogo: { width: 38, height: 38 },
  silaName: { flex: 1, fontSize: 14, fontWeight: '800', color: C.onSurface, lineHeight: 18 },
  silaProgress: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  silaProgressText: { fontSize: 12, fontWeight: '700', color: C.onSurfaceVariant },

  eventBanner: { backgroundColor: C.secondary, borderRadius: 16, padding: 20, overflow: 'hidden' },
  eventDecor: { position: 'absolute', right: -32, bottom: -32, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.1)' },
  eventContent: { gap: 14, zIndex: 10 },
  eventTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  eventSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4, lineHeight: 16 },
  eventBtn: { backgroundColor: '#FFFFFF', borderRadius: 999, paddingVertical: 10, paddingHorizontal: 22, alignSelf: 'flex-start' },
  eventBtnText: { fontSize: 16, fontWeight: '800', color: C.secondary },

  navbar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    paddingTop: 10, backgroundColor: C.navBg, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, elevation: 12,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.3)',
  },
  navItem: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, gap: 2 },
  navItemActive: { backgroundColor: '#ABC270' },
  navItemPressed: { backgroundColor: '#ABC27040' },
  navLabel: { fontSize: 13, fontWeight: '700', color: C.primary + '99', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 2 },
  navLabelActive: { color: C.onSurface },
});
