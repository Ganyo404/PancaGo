import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuizStore } from '../store/useQuizStore';
import { useUserStore } from '../store/useUserStore';

// ── Colour tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#FAFAF3',
  primary: '#52651E',
  primaryContainer: '#D4E8A0',
  onPrimaryContainer: '#161E00',
  secondary: '#5E6644',
  surfaceContainer: '#E8E9E2',
  onSurface: '#1B1C18',
  onSurfaceVariant: '#44483D',
  white: '#FFFFFF',
};

// Data soal sekarang dari quizData.js

// ── Answer button ─────────────────────────────────────────────────────────────
function ChoiceButton({ choice, onPress }) {
  const [pressed, setPressed] = useState(false);
  const scale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 30 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={styles.choiceBtn}
      >
        {/* Letter badge */}
        <View style={styles.choiceBadge}>
          <Text style={styles.choiceBadgeText}>{choice.id}</Text>
        </View>

        {/* Answer text */}
        <Text style={styles.choiceText}>{choice.text}</Text>

        {/* Arrow */}
        <MaterialIcons name="arrow-forward" size={20} color="rgba(255,255,255,0.6)" />
      </Pressable>
    </Animated.View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function QuizQuestionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const recordAnswer = useUserStore((s) => s.recordAnswer);
  const { loadQuizById, getQuizById } = useQuizStore();

  const quizId = params.quizId || '';
  const startIndex = parseInt(params.startIndex || '0', 10);
  const prevScore = parseInt(params.prevScore || '0', 10);

  const [quizSet, setQuizSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [score, setScore] = useState(prevScore);
  const [answered, setAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Fetch soal dari Supabase (atau ambil dari cache)
  useEffect(() => {
    if (!quizId) return;
    const cached = getQuizById(quizId);
    if (cached) {
      setQuizSet(cached);
      setLoading(false);
      return;
    }
    setLoading(true);
    loadQuizById(quizId).then((q) => {
      setQuizSet(q);
      setLoading(false);
    });
  }, [quizId]);

  if (loading || !quizSet) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#52651E" />
        <Text style={{ marginTop: 12, color: '#5E6644', fontWeight: '600' }}>Memuat soal...</Text>
      </View>
    );
  }

  const questions = quizSet.questions;
  const currentQ = questions[currentIndex];
  const totalQ = questions.length;
  const PROGRESS = (currentIndex + 1) / totalQ;

  const handleAnswer = (choice) => {
    if (answered) return;
    const ok = choice.isCorrect;
    const newScore = ok ? score + (quizSet.points / totalQ) : score;
    setScore(newScore);
    recordAnswer(ok);

    setTimeout(() => {
      router.push({
        pathname: '/quiz/feedback',
        params: {
          isCorrect: ok ? 'true' : 'false',
          explanation: currentQ.explanation || 'Jawaban yang tepat!',
          quizId,
          currentIndex: String(currentIndex),
          totalQ: String(totalQ),
          score: String(newScore),
          silaNum: String(quizSet.silaNum || '1'),
        },
      });
      setAnswered(false);
      setShowHint(false);
    }, 600);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.closeBtn, pressed && { backgroundColor: '#f0f4e6' }]}
          onPress={() => router.back()}
        >
          <MaterialIcons name="close" size={22} color="#78716c" />
        </Pressable>

        <Text style={styles.headerTitle}>The Crystal Forest Quest</Text>

        <View style={styles.pointsBadge}>
          <Pressable 
            style={[styles.hintBtn, showHint && styles.hintBtnActive]} 
            onPress={() => setShowHint(!showHint)}
          >
            <MaterialIcons name="lightbulb" size={20} color={showHint ? '#fff' : C.primary} />
            <Text style={[styles.hintText, showHint && { color: '#fff' }]}>Hint</Text>
          </Pressable>
        </View>
      </View>

      {showHint && (
        <View style={styles.hintContainer}>
          <Text style={styles.hintTitle}>Petunjuk 💡</Text>
          <Text style={styles.hintBody}>{currentQ.hint || 'Pikirkan baik-baik ya!'}</Text>
        </View>
      )}

      {/* ── SCROLLABLE CONTENT ───────────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 32 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >

        {/* Progress bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>{quizSet.title}</Text>
            <Text style={styles.progressCount}>{currentIndex + 1} / {totalQ} Soal</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${PROGRESS * 100}%` }]} />
          </View>
        </View>

        {/* Question card */}
        <View style={styles.questionCard}>
          {/* Decorative blob */}
          <View style={styles.questionBlob} />

          {/* Question image */}
          <View style={styles.questionImgWrap}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjtfpvi-188nwk3R9s-3YU4gz2zhRkJ7t5p1xepybm4y60kGZahRi3ieqcb9ym69lNE2yoJu-Gm9F3iBEULMBfmBJVp0eP9YtywSaSfMNx0d8jVlP2ffIEHNfa5NHhKd3U23LR910Bmt6llHdqAMUzhg_wlmO904KimBlb_BGAFw23Ks4cL39RRl1GtB1_Y7MEoQqpNRLTynkS1UXwfbMrQVJyVgQ9UEEyLahjzwGQECxUE12qMfGjkXhN-CTiEOYfjaIQcxuYMGU',
              }}
              style={styles.questionImg}
              resizeMode="cover"
            />
          </View>

          {/* Question text */}
          <Text style={styles.questionText}>
            {currentQ.text}
          </Text>
        </View>

        {/* Answer choices */}
        <View style={styles.choiceList}>
          {currentQ.choices.map((choice) => (
            <ChoiceButton
              key={choice.id}
              choice={choice}
              onPress={() => handleAnswer(choice)}
              disabled={answered}
            />
          ))}
        </View>

        {/* Footer hint */}
        <Text style={styles.footerHint}>
          Pilih satu jawaban yang menurutmu paling tepat untuk melanjutkan quest!
        </Text>

      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(250,249,248,0.9)',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#1B1C1C',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    zIndex: 50,
  },
  closeBtn: {
    padding: 8,
    borderRadius: 999,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#365314',
    letterSpacing: 0.2,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerIcon: {
    padding: 8,
  },

  // SCROLL
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 20,
  },

  // PROGRESS
  progressSection: {
    gap: 8,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
  },
  progressLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: C.secondary,
  },
  progressCount: {
    fontSize: 16,
    fontWeight: '600',
    color: C.onSurfaceVariant,
  },
  progressTrack: {
    height: 22,
    backgroundColor: C.surfaceContainer,
    borderRadius: 999,
    overflow: 'hidden',
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: C.secondary,
    borderRadius: 999,
  },

  // QUESTION CARD
  questionCard: {
    backgroundColor: C.primaryContainer,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 20,
    overflow: 'hidden',
    shadowColor: '#1B1C1C',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  questionBlob: {
    position: 'absolute',
    top: -24,
    right: -24,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(82,101,30,0.1)',
  },
  questionImgWrap: {
    width: 180,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.4)',
    padding: 6,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  questionImg: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  questionText: {
    fontSize: 25,
    fontWeight: '900',
    color: C.onPrimaryContainer,
    textAlign: 'center',
    lineHeight: 30,
    zIndex: 10,
  },

  // CHOICES
  choiceList: {
    gap: 12,
  },
  choiceBtn: {
    backgroundColor: C.secondary,
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  choiceBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  choiceBadgeText: {
    color: C.white,
    fontWeight: '800',
    fontSize: 21,
  },
  choiceText: {
    flex: 1,
    color: C.white,
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 22,
  },

  hintBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1.5,
    borderColor: '#52651E',
  },
  hintBtnActive: {
    backgroundColor: '#52651E',
  },
  hintText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#52651E',
  },
  hintContainer: {
    backgroundColor: '#FFF9C4',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FBC02D',
  },
  hintTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F57F17',
    marginBottom: 4,
  },
  hintBody: {
    fontSize: 14,
    color: '#5D4037',
    lineHeight: 20,
  },
});
