import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgressStore } from '../store/useProgressStore';
import { useQuizStore } from '../store/useQuizStore';
import { useUserStore } from '../store/useUserStore';

const C = {
  bg: '#FAFAF3', primary: '#52651E', primaryContainer: '#D4E8A0',
  secondary: '#5E6644', secondaryContainer: '#E3E9C6',
  tertiary: '#3B6659', tertiaryContainer: '#BDEBD7',
  surface: '#FFFFFF', onSurface: '#1B1C18', onSurfaceVariant: '#44483D',
  amber: '#F5C842', salmon: '#E8957A', salmonContainer: '#FDDECF',
  locked: '#D0D4C8', lockedText: '#9EA39A',
};

const SILA_INFO = [
  { num: 1, name: 'Ketuhanan Yang Maha Esa',                                    logo: require('../assets/images/logopancasila/sila1.png'), heroBg: '#FDDECF' },
  { num: 2, name: 'Kemanusiaan yang Adil dan Beradab',                           logo: require('../assets/images/logopancasila/sila2.png'), heroBg: '#FFF9C4' },
  { num: 3, name: 'Persatuan Indonesia',                                          logo: require('../assets/images/logopancasila/sila3.png'), heroBg: '#BDEBD7' },
  { num: 4, name: 'Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan',           logo: require('../assets/images/logopancasila/sila4.png'), heroBg: '#D4E8A0' },
  { num: 5, name: 'Keadilan Sosial bagi Seluruh Rakyat Indonesia',                logo: require('../assets/images/logopancasila/sila5.jpg'), heroBg: '#E3E9C6' },
];

const LEVEL_COLOR = {
  Pemula:    { bg: C.salmonContainer, icon: C.salmon },
  Menengah:  { bg: C.amber + '44',   icon: '#B08700' },
  Petualang: { bg: C.tertiaryContainer, icon: C.tertiary },
};

function StarRow({ filled }) {
  return (
    <View style={st.starRow}>
      {[1, 2, 3].map(i => (
        <MaterialIcons key={i} name="star" size={13}
          color={i <= filled ? C.tertiary : '#D1D5DB'} />
      ))}
    </View>
  );
}

function QuizItem({ quiz, locked, done, onPress }) {
  const lc = LEVEL_COLOR[quiz.level] || LEVEL_COLOR.Pemula;
  return (
    <Pressable
      onPress={() => !locked && onPress(quiz.id)}
      style={({ pressed }) => [
        st.card,
        locked && st.cardLocked,
        pressed && !locked && { opacity: 0.85, transform: [{ scale: 0.98 }] },
      ]}
    >
      <View style={[st.iconCircle, { backgroundColor: locked ? C.locked : lc.bg }]}>
        {locked
          ? <MaterialIcons name="lock" size={22} color="#fff" />
          : <MaterialIcons
              name={done ? 'check-circle' : quiz.stars === 1 ? 'extension' : quiz.stars === 2 ? 'favorite' : 'explore'}
              size={24} color={lc.icon}
            />
        }
      </View>
      <View style={st.cardBody}>
        <View style={st.cardTopRow}>
          <Text style={[st.cardTitle, locked && { color: C.lockedText }]}>{quiz.title}</Text>
          <Text style={[st.cardPts, locked && { color: C.lockedText }]}>+{quiz.points} Pts</Text>
        </View>
        <StarRow filled={locked ? 0 : quiz.stars} />
        <Text style={[st.cardLevel, locked && { color: C.lockedText }]}>
          TINGKAT: {quiz.level.toUpperCase()}{done ? ' ✓' : ''}
        </Text>
      </View>
    </Pressable>
  );
}

export default function QuizSilaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { silaNum } = useLocalSearchParams();
  const sNum = Number(silaNum) || 1;

  const { points } = useUserStore();
  // Baca completedQuizIds langsung dari store (reactive)
  const completedQuizIds = useProgressStore((s) => s.completedQuizIds);
  const { loadQuizzesBySila, getQuizzesBySila, isLoadingSila, error } = useQuizStore();

  // Ticker untuk force re-render saat layar kembali fokus
  const [focusTick, setFocusTick] = useState(0);

  const sila = SILA_INFO.find(s => s.num === sNum) ?? SILA_INFO[0];

  // Fetch soal dari Supabase saat layar pertama dibuka
  useEffect(() => {
    loadQuizzesBySila(sNum);
  }, [sNum]);

  // Force re-render setiap kali layar kembali aktif (setelah balik dari quiz)
  useFocusEffect(
    useCallback(() => {
      setFocusTick(t => t + 1);
    }, [])
  );

  const quizzes = getQuizzesBySila(sNum);
  const loading = isLoadingSila(sNum);

  return (
    <View style={st.container}>
      {/* HEADER */}
      <View style={[st.header, { paddingTop: insets.top + 12 }]}>
        <Pressable style={st.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={22} color={C.onSurface} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={st.headerApp}>PANCAGO!</Text>
          <Text style={st.headerTitle}>Kuis Sila {sNum}</Text>
        </View>
        <View style={st.pointsBadge}>
          <MaterialIcons name="stars" size={18} color={C.primary} />
          <Text style={st.pointsText}>{points.toLocaleString('id-ID')} Pts</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}
        <View style={[st.hero, { backgroundColor: sila.heroBg }]}>
          <View style={st.heroLeft}>
            <Text style={st.heroSub}>SILA KE-{sNum}</Text>
            <Text style={st.heroName}>{sila.name}</Text>
            <Text style={st.heroDesc}>Pilih level quiz dan buktikan pengetahuanmu!</Text>
          </View>
          <Image source={sila.logo} style={st.heroLogo} resizeMode="contain" />
        </View>

        {/* LOADING STATE */}
        {loading && (
          <View style={st.loadingWrap}>
            <ActivityIndicator size="large" color={C.primary} />
            <Text style={st.loadingText}>Memuat soal...</Text>
          </View>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <View style={st.errorWrap}>
            <MaterialIcons name="wifi-off" size={40} color={C.onSurfaceVariant} />
            <Text style={st.errorText}>Gagal memuat soal. Periksa koneksimu.</Text>
            <Pressable style={st.retryBtn} onPress={() => loadQuizzesBySila(sNum)}>
              <Text style={st.retryText}>Coba Lagi</Text>
            </Pressable>
          </View>
        )}

        {/* QUIZ LIST — dikelompokkan per difficulty */}
        {!loading && !error && quizzes.length > 0 && (
          ['Pemula', 'Menengah', 'Petualang'].map((levelName, li) => {
            const chunk = quizzes.filter(q => q.level === levelName);
            return (
              <View key={levelName} style={st.section}>
                <View style={st.sectionHeader}>
                  <MaterialIcons
                    name={li === 0 ? 'emoji-events' : li === 1 ? 'military-tech' : 'rocket-launch'}
                    size={18} color={C.primary}
                  />
                  <Text style={st.sectionTitle}>{levelName}</Text>
                </View>
                {chunk.map((quiz, idx) => {
                  // Cari index global quiz ini di dalam seluruh 9 quiz sila ini
                  const globalIdx = quizzes.findIndex(q => q.id === quiz.id);
                  const prevQuiz = globalIdx > 0 ? quizzes[globalIdx - 1] : null;
                  const done = completedQuizIds.includes(quiz.id);
                  const locked = globalIdx > 0 && !completedQuizIds.includes(prevQuiz?.id);
                  return (
                    <QuizItem
                      key={quiz.id}
                      quiz={quiz}
                      locked={locked}
                      done={done}
                      onPress={(id) => router.push(`/quiz/question?quizId=${encodeURIComponent(id)}`)}
                    />
                  );
                })}
              </View>
            );
          })
        )}

        {/* EVENT BANNER */}
        <View style={st.eventBanner}>
          <View style={st.eventDecor} />
          <Text style={st.eventTitle}>Event Mingguan</Text>
          <Text style={st.eventSub}>Selesaikan 5 kuis untuk lencana 'Pahlawan Cilik'!</Text>
          <Pressable style={st.eventBtn}>
            <Text style={st.eventBtnText}>Ikuti Sekarang</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingBottom: 14,
    backgroundColor: C.bg, zIndex: 10,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  headerApp: { fontSize: 11, fontWeight: '800', letterSpacing: 2, color: C.onSurfaceVariant, textTransform: 'uppercase' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: C.primary, letterSpacing: -0.3 },
  pointsBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: C.primaryContainer, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999,
  },
  pointsText: { fontWeight: '800', fontSize: 14, color: C.onSurface },

  hero: {
    marginHorizontal: 20, marginBottom: 8, borderRadius: 20,
    padding: 20, flexDirection: 'row', alignItems: 'center',
  },
  heroLeft: { flex: 1 },
  heroSub: { fontSize: 12, fontWeight: '800', letterSpacing: 2, color: C.secondary, textTransform: 'uppercase', marginBottom: 4 },
  heroName: { fontSize: 18, fontWeight: '900', color: C.onSurface, lineHeight: 22, marginBottom: 8 },
  heroDesc: { fontSize: 13, color: C.onSurfaceVariant, lineHeight: 18 },
  heroLogo: { width: 80, height: 80, marginLeft: 12 },

  loadingWrap: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  loadingText: { fontSize: 15, color: C.onSurfaceVariant, fontWeight: '600' },

  errorWrap: { alignItems: 'center', paddingVertical: 48, gap: 12, paddingHorizontal: 32 },
  errorText: { fontSize: 15, color: C.onSurfaceVariant, textAlign: 'center', lineHeight: 20 },
  retryBtn: { backgroundColor: C.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 999 },
  retryText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  section: { paddingHorizontal: 20, marginTop: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '900', color: C.primary, textTransform: 'uppercase', letterSpacing: 1.2 },

  card: {
    backgroundColor: C.surface, borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
  },
  cardLocked: { opacity: 0.6 },
  iconCircle: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardBody: { flex: 1 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 17, fontWeight: '800', color: C.onSurface, flex: 1 },
  cardPts: { fontSize: 13, fontWeight: '800', color: C.primary, marginLeft: 6, flexShrink: 0 },
  starRow: { flexDirection: 'row', gap: 2, marginTop: 4 },
  cardLevel: { fontSize: 11, fontWeight: '800', color: C.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 1.2, marginTop: 5 },

  eventBanner: {
    marginHorizontal: 20, marginTop: 24, backgroundColor: C.secondary,
    borderRadius: 20, padding: 22, overflow: 'hidden',
  },
  eventDecor: {
    position: 'absolute', right: -30, bottom: -30,
    width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.08)',
  },
  eventTitle: { fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 4 },
  eventSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 18, marginBottom: 14 },
  eventBtn: { backgroundColor: '#fff', borderRadius: 999, paddingVertical: 10, paddingHorizontal: 20, alignSelf: 'flex-start' },
  eventBtnText: { fontSize: 14, fontWeight: '800', color: C.secondary },
});
