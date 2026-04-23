import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const C = {
  bg: '#ABC270',
  primary: '#52651E',
  primaryDark: '#3B4D06',
  primaryContainer: '#D4E8A0',
  secondary: '#5E6644',
  surfaceLowest: '#FFFFFF',
  surfaceContainerLow: '#F4F5EE',
  onSurface: '#1B1C18',
  onSurfaceVariant: '#44483D',
  tertiary: '#BDEBD7',
  onTertiary: '#003730',
};

// ── Pagination dots ───────────────────────────────────────────────────────────
function PaginationDots() {
  const dots = [false, false, true, false, false]; // index 2 is active
  return (
    <View style={styles.dotsRow}>
      {dots.map((active, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            active ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function QuizFeedbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [btnPressed, setBtnPressed] = React.useState(false);

  const isCorrect = params.isCorrect === 'true';
  const earnedPoints = params.earnedPoints || '0';
  const nextQuestion = params.nextQuestion !== undefined ? parseInt(params.nextQuestion, 10) : null;
  const quizId = params.quizId || null;
  const totalScore = params.totalScore || earnedPoints;

  const titleText = isCorrect ? 'Benar! Kamu Hebat!' : 'Sayang Sekali!';
  const subtitleText = isCorrect 
    ? 'Kamu berhasil menjawab tantangan ini.\nAyo kumpulkan lebih banyak koin!'
    : 'Jawabanmu kurang tepat.\nJangan menyerah, coba pelajari lagi!';
  const pointsColor = isCorrect ? C.primary : '#E53E3E';

  const handleLanjut = () => {
    router.push({
      pathname: '/quiz/result',
      params: { finalScore: totalScore, quizId },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 16 }]}>

      {/* Background blobs */}
      <View style={styles.blobTL} pointerEvents="none" />
      <View style={styles.blobBR} pointerEvents="none" />

      {/* ── Card ──────────────────────────────────────────────────────────── */}
      <View style={styles.card}>

        {/* Mascot */}
        <View style={styles.mascotArea}>
          <View style={styles.mascotRing}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLEo4cKB9IuM8seYV6vkRtfImNhZIFDS6PXAtfT9-Xcr6j-RYqqaHE18hb4Dcn2Je16qKNCGAyheNQaJ2N_jzshipvL7fDpES4Hu9zfbMvabCo4HQLfzdKMHQ4hg8yJdQsXFoKHVcNz-lwQ1xj3cd19FakNoxt_g1eO3pOYzyYsKC2wf-Qq5_gvCla0hqBXRxjXwnrQiLNeEIVlfDzWph5qwBEIFGn9EFofM73MCmo-gDN65wWfggqLUmc73Ibgj2SoQ6v-p9ObCk',
              }}
              style={styles.mascotImg}
              resizeMode="contain"
            />
          </View>

          {/* Star badge */}
          <View style={styles.starBadge}>
            <MaterialIcons name="star" size={28} color={C.onTertiary} />
          </View>
        </View>

        {/* Heading */}
        <View style={styles.headingArea}>
          <Text style={[styles.title, !isCorrect && { color: pointsColor }]}>{titleText}</Text>
          <Text style={styles.subtitle}>
            {subtitleText}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Poin Didapat</Text>
            <View style={styles.statValue}>
              <MaterialIcons name="monetization-on" size={26} color={pointsColor} />
              <Text style={[styles.statNum, { color: pointsColor }]}>+{earnedPoints}</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Waktu</Text>
            <View style={styles.statValue}>
              <MaterialIcons name="timer" size={26} color={C.secondary} />
              <Text style={[styles.statNum, { color: C.secondary }]}>0:45</Text>
            </View>
          </View>
        </View>

        {/* CTA button — 3D press effect */}
        <Pressable
          onPressIn={() => setBtnPressed(true)}
          onPressOut={() => setBtnPressed(false)}
          onPress={handleLanjut}
          style={[
            styles.ctaBtn,
            btnPressed && styles.ctaBtnPressed,
          ]}
        >
          <Text style={styles.ctaBtnText}>Lanjut</Text>
          <MaterialIcons name="arrow-forward" size={24} color="#fff" />
        </Pressable>

        {/* Detail link */}
        <Pressable style={styles.detailLink}>
          <Text style={styles.detailLinkText}>LIHAT DETAIL JAWABAN</Text>
        </Pressable>

      </View>

      {/* Pagination dots */}
      <PaginationDots />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 28,
    overflow: 'hidden',
  },

  // Background blobs
  blobTL: {
    position: 'absolute',
    top: 40,
    left: 40,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(212,232,160,0.3)',
  },
  blobBR: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(82,101,30,0.2)',
  },

  // CARD
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: C.surfaceLowest,
    borderRadius: 28,
    paddingHorizontal: 28,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 16 },
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    zIndex: 10,
  },

  // MASCOT
  mascotArea: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  mascotRing: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(212,232,160,0.2)',
    borderWidth: 4,
    borderColor: 'rgba(82,101,30,0.2)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mascotImg: {
    width: 200,
    height: 200,
  },
  starBadge: {
    position: 'absolute',
    top: -10,
    right: -6,
    backgroundColor: C.tertiary,
    padding: 12,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ rotate: '12deg' }],
  },

  // HEADING
  headingArea: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 35,
    fontWeight: '900',
    color: C.primary,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 19,
    fontWeight: '500',
    color: C.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // STATS
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: C.surfaceContainerLow,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(82,101,30,0.15)',
    gap: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: C.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  statValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  statNum: {
    fontSize: 33,
    fontWeight: '900',
  },

  // CTA BUTTON — 3D press effect
  ctaBtn: {
    width: '100%',
    backgroundColor: C.primary,
    borderRadius: 999,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: C.primaryDark,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    transform: [{ translateY: 0 }],
  },
  ctaBtnPressed: {
    shadowOffset: { width: 0, height: 2 },
    transform: [{ translateY: 4 }],
  },
  ctaBtnText: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
  },

  // DETAIL LINK
  detailLink: {
    paddingVertical: 4,
  },
  detailLinkText: {
    fontSize: 15,
    fontWeight: '800',
    color: C.secondary,
    letterSpacing: 1,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },

  // DOTS
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    width: 28,
    backgroundColor: '#FFFFFF',
  },
  dotInactive: {
    width: 10,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
});
