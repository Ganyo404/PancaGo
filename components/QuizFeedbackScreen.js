import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';
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

// ── Main screen ───────────────────────────────────────────────────────────────
export default function QuizFeedbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [btnPressed, setBtnPressed] = React.useState(false);

  const isCorrect = params.isCorrect === 'true';
  const quizId = params.quizId || null;
  const explanation = params.explanation || '';
  const currentIndex = parseInt(params.currentIndex || '0', 10);
  const totalQ = parseInt(params.totalQ || '0', 10);
  const currentScore = params.score || '0';
  const silaNum = params.silaNum || '1';

  const titleText = isCorrect ? 'Benar! Kamu Hebat!' : 'Sayang Sekali!';
  const pointsColor = isCorrect ? C.primary : '#E53E3E';

  const handleLanjut = () => {
    if (currentIndex + 1 < totalQ) {
      router.push({
        pathname: '/quiz/question',
        params: { 
          quizId, 
          startIndex: String(currentIndex + 1),
          prevScore: currentScore
        },
      });
    } else {
      router.push({
        pathname: '/quiz/result',
        params: {
          finalScore: currentScore,
          quizId,
          passed: parseFloat(currentScore) > 0 ? 'true' : 'false',
          silaNum: params.silaNum || '1',
        },
      });
    }
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
              source={require('../assets/images/characters/Asih/Asih1.png')}
              style={styles.mascotImg}
              resizeMode="contain"
            />
          </View>

          {/* Correct/Incorrect Icon badge */}
          <View style={[styles.starBadge, !isCorrect && { backgroundColor: '#E53E3E' }]}>
            <MaterialIcons name={isCorrect ? "check" : "close"} size={28} color="#fff" />
          </View>
        </View>

        {/* Heading */}
        <View style={styles.headingArea}>
          <Text style={[styles.title, !isCorrect && { color: '#E53E3E' }]}>{titleText}</Text>
          <View style={styles.explanationBox}>
             <Text style={styles.explanationText}>{explanation}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Skor Saat Ini</Text>
            <View style={styles.statValue}>
              <MaterialIcons name="stars" size={26} color={C.primary} />
              <Text style={[styles.statNum, { color: C.primary }]}>{Math.round(currentScore)}</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Progres</Text>
            <View style={styles.statValue}>
              <MaterialIcons name="Assignment" size={26} color={C.secondary} />
              <Text style={[styles.statNum, { color: C.secondary }]}>{currentIndex + 1}/{totalQ}</Text>
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
            !isCorrect && { backgroundColor: C.secondary, shadowColor: '#2D331C' }
          ]}
        >
          <Text style={styles.ctaBtnText}>
            {currentIndex + 1 < totalQ ? 'Soal Berikutnya' : 'Lihat Hasil'}
          </Text>
          <MaterialIcons name="arrow-forward" size={24} color="#fff" />
        </Pressable>

      </View>

      {/* Progress indicators */}
      <View style={styles.dotsRow}>
        {Array.from({ length: totalQ }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentIndex ? styles.dotActive : styles.dotInactive,
              i < currentIndex && { backgroundColor: '#fff', opacity: 0.8 }
            ]}
          />
        ))}
      </View>
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
  // EXPLANATION
  explanationBox: {
    backgroundColor: C.surfaceContainerLow,
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    width: '100%',
  },
  explanationText: {
    fontSize: 16,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
  },
});
