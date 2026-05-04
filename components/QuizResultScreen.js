import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef } from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/useAuthStore';
import { useProgressStore } from '../store/useProgressStore';
import { useUserStore } from '../store/useUserStore';

const { width: SW } = Dimensions.get('window');

const C = {
  bg: '#ABC270',
  primary: '#52651E',
  primaryContainer: '#D4E8A0',
  secondary: '#5E6644',
  surface: '#FAFAF3',
  surfaceLowest: '#FFFFFF',
  surfaceContainerLow: '#F4F5EE',
  onSurface: '#1B1C18',
  brown: '#564334',
  darkGreen: '#3b4d06',
  navBg: 'rgba(255,255,255,0.92)',
};

// ── Nav item ─────────────────────────────────────────────────────────────────
function NavItem({ icon, label, active = false, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.navItem,
        active && styles.navItemActive,
        pressed && !active && { backgroundColor: '#ABC27040' },
      ]}
    >
      <MaterialIcons name={icon} size={24} color={active ? C.onSurface : C.primary + '99'} />
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </Pressable>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function QuizResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const { points, addPoints } = useUserStore();
  const { completeQuiz } = useProgressStore();
  const { updateProfile, updateProgress } = useAuthStore();

  const finalScore = parseInt(params.finalScore || '0', 10);
  const quizId = params.quizId;
  const passed = params.passed === 'true';
  const silaNum = params.silaNum || '1';

  // Ref untuk pastikan sync hanya jalan sekali, tidak infinite loop
  const hasSynced = useRef(false);

  React.useEffect(() => {
    if (hasSynced.current) return;
    hasSynced.current = true;

    const syncData = async () => {
      try {
        if (finalScore > 0) {
          const { points: newPoints, level: newLevel } = addPoints(finalScore);
          await updateProfile({ points: newPoints, level: newLevel });
        }
        if (quizId && passed) {
          const newQuizIds = completeQuiz(quizId);
          await updateProgress({ completed_quiz_ids: newQuizIds });
        }
      } catch (_) {
        // Sync gagal — tidak crash app, data lokal tetap benar
      }
    };
    syncData();
  }, []);

  // points sudah diupdate oleh addPoints — tampilkan langsung dari store
  const totalScore = points;

  return (
    <View style={styles.container}>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarWrap}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCJERqnMIch39q3VA_ju5udoXlzr-Lc20iMl9UFt3uPsZAwyat0J8F_R3hBsFXggIM7FTM04qB-7xW-TlNI--vEqmCgSa5sg8XRlMUmaqqWhtUSISq8_CBTl1wn1GaJNogMTl2b0d0pmiSv53ecVt0K8fDwzydAPMzSI6UEMVDhYx4nkE-zFB8vxOPVIjy09VDNJCDKhxXiQAW-_0VYvtAzjrn2i8s1_YRar1vVzq13BCQbSZ0LOj9NGA2Q3XhSuf4iUtpH9BbWTg',
              }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.greeting}>Pagi Petualang!</Text>
        </View>
        <View style={styles.pointsBadge}>
          <MaterialIcons name="stars" size={18} color={C.primary} />
          <Text style={styles.pointsText}>{totalScore} Pts</Text>
        </View>
      </View>

      {/* ── SCROLLABLE CONTENT ───────────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 110 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Mascot celebration area ────────────────────────────────────── */}
        <View style={styles.mascotArea}>
          {/* Background blobs */}
          <View style={styles.mascotBlob} />

          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCi6Nvlg9ceweGZKx1lBSdW0VM8ZBE682p2jogQgsozslBqSU7QY0xftQneaqPi_-_WesOlu700q8GBc6ho8_VEE5TAvFETV8aoa9zfd4puJXKctJfODXoiQSBxLsHXx4legoN0MsThYlCi8OJX2mk-F9U29MIjWot2xhAzyF86IW6yLt0fJpxCNWfCMXlDxPv3EIBARku0Ye_fXxxoJiV88bsiaX8w9d73OdghPUqDzg8sT9fPRrpWVUKFZ-ZD96OEY1HuutJzMmk',
            }}
            style={styles.mascotImg}
            resizeMode="contain"
          />

          {/* Floating pts badge */}
          <View style={styles.ptsBadge}>
            <Text style={styles.ptsBadgeText}>+{finalScore} Pts</Text>
          </View>
        </View>

        {/* ── Result card ───────────────────────────────────────────────────── */}
        <View style={styles.resultCard}>
          {/* Decorative blob */}
          <View style={styles.cardBlob} />

          <Text style={styles.cardSub}>Quiz Selesai!</Text>
          <Text style={[styles.cardTitle, !passed && { color: '#E53E3E' }]}>
            {passed ? 'Hebat Sekali!' : 'Coba Lagi!'}
          </Text>

          <View style={styles.scoreRow}>
            <MaterialIcons name="emoji-events" size={32} color="#ebc23e" />
            <Text style={styles.scoreText}>Skor Kamu: {totalScore}</Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '85%' }]} />
          </View>
          <Text style={styles.rankText}>
            {passed
              ? 'Kamu lebih unggul dari 92% pemain hari ini!'
              : 'Jawab dengan benar untuk membuka quiz berikutnya!'}
          </Text>

          {/* Action buttons */}
          <View style={styles.btnGroup}>
            <Pressable
              style={({ pressed }) => [styles.primaryBtnWrap, pressed && { opacity: 0.87 }]}
              onPress={() => router.replace(`/quiz/sila?silaNum=${silaNum}`)}
            >
              <LinearGradient
                colors={['#6b8227', '#8bad3f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryBtn}
              >
                <Text style={styles.primaryBtnText}>Lanjut Belajar</Text>
                <MaterialIcons name="arrow-forward" size={22} color="#fff" />
              </LinearGradient>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.87 }]}
              onPress={() => {
                router.replace(`/quiz/question?quizId=${encodeURIComponent(quizId)}`);
              }}
            >
              <MaterialIcons name="replay" size={20} color={C.brown} />
              <Text style={styles.secondaryBtnText}>Jawab Ulang</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Did you know card ─────────────────────────────────────────────── */}
        <View style={styles.tipCard}>
          <View style={styles.tipIconWrap}>
            <MaterialIcons name="lightbulb" size={24} color={C.primary} />
          </View>
          <View style={styles.tipBody}>
            <Text style={styles.tipTitle}>Tahukah Kamu?</Text>
            <Text style={styles.tipText}>
              Panca Indera kita bekerja sama untuk membantumu menjelajahi dunia setiap hari!
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* ── BOTTOM NAV ──────────────────────────────────────────────────────── */}
      <View style={[styles.navbar, { paddingBottom: insets.bottom + 8 }]}>
        <NavItem icon="home" label="Home" onPress={() => router.push('/home')} />
        <NavItem icon="extension" label="Quiz" active onPress={() => router.push('/quiz')} />
        <NavItem icon="face" label="Karakter" onPress={() => router.push('/karakter')} />
        <NavItem icon="map" label="Misi" onPress={() => router.push('/misi')} />
        <NavItem icon="person" label="Profil" onPress={() => router.push('/profil')} />
      </View>

    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
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
    paddingBottom: 12,
    backgroundColor: 'rgba(250,250,243,0.85)',
    zIndex: 50,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: C.primary,
    overflow: 'hidden',
    backgroundColor: C.primaryContainer,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: -0.2,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(82,101,30,0.1)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(82,101,30,0.2)',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: 0.3,
  },

  // SCROLL
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 16,
    alignItems: 'center',
  },

  // MASCOT AREA
  mascotArea: {
    width: SW - 40,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mascotBlob: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(184,208,124,0.4)',
    top: '50%',
    left: '50%',
    marginTop: -120,
    marginLeft: -120,
  },
  mascotImg: {
    width: '85%',
    height: '85%',
    zIndex: 10,
  },
  ptsBadge: {
    position: 'absolute',
    top: '15%',
    right: '5%',
    backgroundColor: 'rgba(255,255,255,0.96)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    transform: [{ rotate: '6deg' }],
    zIndex: 20,
  },
  ptsBadgeText: {
    fontSize: 23,
    fontWeight: '900',
    color: C.darkGreen,
  },

  // RESULT CARD
  resultCard: {
    width: '100%',
    backgroundColor: C.surfaceLowest,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
  },
  cardBlob: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(212,232,160,0.3)',
  },
  cardSub: {
    fontSize: 14,
    fontWeight: '800',
    color: C.brown,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  cardTitle: {
    fontSize: 41,
    fontWeight: '900',
    color: C.primary,
    letterSpacing: -0.5,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  scoreText: {
    fontSize: 25,
    fontWeight: '800',
    color: '#574500',
  },
  progressTrack: {
    width: '100%',
    height: 16,
    backgroundColor: '#EAE8E7',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8bad3f',
    borderRadius: 999,
  },
  rankText: {
    fontSize: 16,
    fontWeight: '700',
    color: C.brown,
    textAlign: 'center',
  },
  btnGroup: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  primaryBtnWrap: {
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: 'rgba(82,101,30,0.3)',
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  primaryBtn: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 999,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  secondaryBtn: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 999,
    backgroundColor: '#f4ebd9',
    borderWidth: 3,
    borderColor: '#e8dcc4',
  },
  secondaryBtnText: {
    fontSize: 19,
    fontWeight: '800',
    color: C.brown,
  },

  // TIP CARD
  tipCard: {
    width: '100%',
    backgroundColor: 'rgba(171,194,112,0.2)',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  tipIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.surfaceLowest,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tipBody: {
    flex: 1,
    paddingTop: 4,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.darkGreen,
  },
  tipText: {
    fontSize: 16,
    fontWeight: '500',
    color: C.darkGreen,
    lineHeight: 20,
    marginTop: 4,
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
  navLabel: {
    fontSize: 13,
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
