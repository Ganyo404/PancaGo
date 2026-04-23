import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
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

const { width: SW } = Dimensions.get('window');

// ── Colour tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#ABC270',
  primary: '#52651E',
  primaryContainer: '#D4E8A0',
  secondary: '#5E6644',
  secondaryContainer: '#E3E9C6',
  tertiary: '#3B6659',
  tertiaryContainer: '#BDEBD7',
  onSurface: '#1B1C18',
  onSurfaceVariant: '#44483D',
  white90: 'rgba(255,255,255,0.90)',
  salmon: '#E8957A',
  amber: '#F5C842',
  salmonContainer: '#FDDECF',
  surfaceContainerHighest: '#DDDEDA',
};

// ── Per-misi scenario data ────────────────────────────────────────────────────
const MISI_SCENARIOS = {
  1: {
    heroUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC3Y9WLGIMijE0jFM6VHrGiT9LkecbNPb4gOFtaIyBPzVYa8bZf52-k5Kfqfb28VPf_HJgVm5p9KX3FKx2eZ4QvujO50Hs4dHBDDj-7t40lz4B9JqY18XBFHWI0RsPKL9z-XeW_5v_jX1_iBxKilVDFYCFNDPWLYGFOE5GX3dVCxWm9qidj1Dw2D6KVQnLTMJlqQhRK_wBidyNRz1iH8v8UtlNuFc3-kX8vI2I1YaD4ltnXQ6aFNO5k9FTyNWHHJkfHIVSDq1VY',
    scenes: [
      {
        question: 'Budi melihat teman-temannya merayakan hari raya berbeda. Apa yang harus Budi lakukan?',
        hint: 'Sila pertama mengajarkan kita untuk saling menghargai keyakinan orang lain.',
        explanation: 'Menghargai perayaan agama lain adalah bentuk nyata toleransi beragama sesuai Sila ke-1.',
        choices: [
          { id: 'a', icon: 'favorite', label: 'Ikut merayakan bersama', sub: 'Tunjukkan sikap toleransi', color: C.tertiaryContainer, iconColor: C.tertiary },
          { id: 'b', icon: 'block',    label: 'Menolak ikut serta',    sub: 'Karena berbeda agama',   color: C.salmonContainer,    iconColor: C.salmon      },
          { id: 'c', icon: 'visibility', label: 'Melihat dari jauh',    sub: 'Tidak ingin terlibat',  color: C.surfaceContainerHighest, iconColor: C.onSurfaceVariant },
        ],
        correctId: 'a',
      },
      {
        question: 'Di kelas, ada teman yang mengejek agama orang lain. Apa yang Budi lakukan?',
        hint: 'Kita harus membela kebenaran dan menjaga perasaan orang lain.',
        explanation: 'Menegur dengan baik membantu menciptakan lingkungan yang damai dan saling menghormati.',
        choices: [
          { id: 'a', icon: 'thumb-down',    label: 'Ikut mengejek',          sub: 'Agar dianggap keren',       color: C.salmonContainer,         iconColor: C.salmon           },
          { id: 'b', icon: 'record-voice-over', label: 'Menegur dengan baik', sub: 'Ajak menghargai perbedaan', color: C.tertiaryContainer,       iconColor: C.tertiary         },
          { id: 'c', icon: 'hearing',       label: 'Diam saja',             sub: 'Pura-pura tidak dengar',    color: C.surfaceContainerHighest, iconColor: C.onSurfaceVariant },
        ],
        correctId: 'b',
      },
    ],
  },
  2: {
    heroUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBqr4YhiMREiwWe4j0WU4oVg3aK-iMWjQHX4MDPuBjl_HMpGz6X5dVAuKWEIqvf_cPM-n2v91WpJNj4RzCHnKQ6OwQoFVWnQ9q6N3Nj4N3ZGWlAuJd8xDEPCBGz-bYfVPJSlJJYlEMuY9xCBQsHoZUxP2VzXf0FzH1mJzXKHnTVVaAX7GGEUfJkHkJIqbUHRt-kSHzlvomFMkOLmI-cCbq1dvq0fJBJf8UtgUuwDjb2dOJlkSTEWY_iS6sO7mPHAqT36M_vFsco',
    scenes: [
      {
        question: 'Di jalan, Budi melihat orang tua kesulitan membawa belanjaan. Apa yang Budi lakukan?',
        hint: 'Bantulah sesama manusia tanpa memandang usia.',
        explanation: 'Membantu orang lain yang kesulitan adalah pengamalan nilai kemanusiaan yang adil dan beradab.',
        choices: [
          { id: 'a', icon: 'directions-walk', label: 'Lewat begitu saja',        sub: 'Buru-buru pulang',            color: C.salmonContainer,         iconColor: C.salmon           },
          { id: 'b', icon: 'volunteer-activism', label: 'Menawarkan bantuan',    sub: 'Tunjukkan sikap peduli',      color: C.tertiaryContainer,       iconColor: C.tertiary         },
          { id: 'c', icon: 'camera-alt',     label: 'Memotret lalu pergi',       sub: 'Untuk cerita ke teman',       color: C.surfaceContainerHighest, iconColor: C.onSurfaceVariant },
        ],
        correctId: 'b',
      },
    ],
  },
  3: {
    heroUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDbo7LcxIWuFnw-gNiTYSezp2-SOPrwlXCwWklGnRz1ySMrP8EsXU8MKVTcJgCOTkSJnlluDG2OrLc7VkwdimHtf5HlQh-9RWSET6Zgr95c0eKEhdLZnPMoOTbJpke-dgvFEWkoJJWbe67Izf22sa5t5MgVjCF07hZv_Dj0LXHLAUR6FbdIa7XcqV9FWK5ku0mxBGD6EGCehLyxfiChO21Bq2Mdgz3zx7zapWWiXbYevSIcYR6p9pSMtnnqiruc-5CFWFbBFfHwsGs',
    scenes: [
      {
        question: 'Di sekolah, Budi melihat temannya terjatuh. Apa yang harus Budi lakukan?',
        hint: 'Persatuan dimulai dari kepedulian terhadap teman terdekat.',
        explanation: 'Menolong teman mempererat tali persaudaraan dan persatuan di sekolah.',
        choices: [
          { id: 'a', icon: 'volunteer-activism', label: 'Membantu teman',         sub: 'Tunjukkan sikap peduli sesama',   color: C.tertiaryContainer,       iconColor: C.tertiary         },
          { id: 'b', icon: 'support-agent',      label: 'Mengadu ke Guru',        sub: 'Meminta bantuan orang dewasa',    color: C.salmonContainer,         iconColor: C.salmon           },
          { id: 'c', icon: 'visibility',         label: 'Melihat Keadaan',        sub: 'Memastikan tidak ada bahaya lain',color: C.surfaceContainerHighest, iconColor: C.onSurfaceVariant },
        ],
        correctId: 'a',
      },
      {
        question: 'Kelompok belajar Budi berselisih pilihan tema proyek. Apa yang Budi lakukan?',
        hint: 'Cari jalan tengah agar semua orang merasa senang.',
        explanation: 'Musyawarah adalah cara terbaik untuk mencapai kesepakatan tanpa pertengkaran.',
        choices: [
          { id: 'a', icon: 'record-voice-over', label: 'Memaksa pilihan sendiri', sub: 'Tidak mau kompromi',           color: C.salmonContainer,         iconColor: C.salmon           },
          { id: 'b', icon: 'groups',            label: 'Musyawarah bersama',     sub: 'Cari solusi yang disepakati',  color: C.tertiaryContainer,       iconColor: C.tertiary         },
          { id: 'c', icon: 'sentiment-dissatisfied', label: 'Diam dan cemberut', sub: 'Biar yang lain yang putuskan', color: C.surfaceContainerHighest, iconColor: C.onSurfaceVariant },
        ],
        correctId: 'b',
      },
      {
        question: 'Ada teman baru dari daerah lain bergabung di kelas. Budi sebaiknya…',
        hint: 'Sikap ramah membantu persatuan antar daerah.',
        explanation: 'Menyambut teman baru dari daerah manapun adalah wujud persatuan Indonesia.',
        choices: [
          { id: 'a', icon: 'person-add',  label: 'Menyambut dengan hangat', sub: 'Ajak berkenalan bersama',      color: C.tertiaryContainer,       iconColor: C.tertiary         },
          { id: 'b', icon: 'do-not-disturb', label: 'Mengabaikannya',       sub: 'Sudah punya teman sendiri',   color: C.salmonContainer,         iconColor: C.salmon           },
          { id: 'c', icon: 'help-outline','label': 'Menunggunya duluan',    sub: 'Biar dia yang kenalan dulu',  color: C.surfaceContainerHighest, iconColor: C.onSurfaceVariant },
        ],
        correctId: 'a',
      },
    ],
  },
  4: {
    heroUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC3Y9WLGIMijE0jFM6VHrGiT9LkecbNPb4gOFtaIyBPzVYa8bZf52-k5Kfqfb28VPf_HJgVm5p9KX3FKx2eZ4QvujO50Hs4dHBDDj-7t40lz4B9JqY18XBFHWI0RsPKL9z-XeW_5v_jX1_iBxKilVDFYCFNDPWLYGFOE5GX3dVCxWm9qidj1Dw2D6KVQnLTMJlqQhRK_wBidyNRz1iH8v8UtlNuFc3-kX8vI2I1YaD4ltnXQ6aFNO5k9FTyNWHHJkfHIVSDq1VY',
    scenes: [
      {
        question: 'Kelas Budi harus memilih ketua kelas baru. Cara yang tepat adalah…',
        hint: 'Gunakan musyawarah atau pemungutan suara.',
        explanation: 'Voting adalah salah satu cara berdemokrasi yang adil untuk mencapai mufakat.',
        choices: [
          { id: 'a', icon: 'how-to-vote',  label: 'Voting bersama',           sub: 'Suara semua orang didengar',   color: C.tertiaryContainer,       iconColor: C.tertiary         },
          { id: 'b', icon: 'person',       label: 'Budi yang tentukan',       sub: 'Karena merasa paling pintar',  color: C.salmonContainer,         iconColor: C.salmon           },
          { id: 'c', icon: 'shuffle',      label: 'Diundi saja',              sub: 'Biar cepat selesai',           color: C.surfaceContainerHighest, iconColor: C.onSurfaceVariant },
        ],
        correctId: 'a',
      },
    ],
  },
  5: {
    heroUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBqr4YhiMREiwWe4j0WU4oVg3aK-iMWjQHX4MDPuBjl_HMpGz6X5dVAuKWEIqvf_cPM-n2v91WpJNj4RzCHnKQ6OwQoFVWnQ9q6N3Nj4N3ZGWlAuJd8xDEPCBGz-bYfVPJSlJJYlEMuY9xCBQsHoZUxP2VzXf0FzH1mJzXKHnTVVaAX7GGEUfJkHkJIqbUHRt-kSHzlvomFMkOLmI-cCbq1dvq0fJBJf8UtgUuwDjb2dOJlkSTEWY_iS6sO7mPHAqT36M_vFsco',
    scenes: [
      {
        question: 'Budi melihat teman yang tidak kebagian makanan saat pesta kelas. Budi sebaiknya…',
        hint: 'Keadilan berarti semua orang mendapatkan haknya.',
        explanation: 'Berbagi secara adil memastikan setiap orang merasa dihargai.',
        choices: [
          { id: 'a', icon: 'fastfood',     label: 'Makan sendirian saja',     sub: 'Sudah ambil duluan',           color: C.salmonContainer,         iconColor: C.salmon           },
          { id: 'b', icon: 'share',        label: 'Berbagi makanannya',       sub: 'Agar semua bisa menikmati',   color: C.tertiaryContainer,       iconColor: C.tertiary         },
          { id: 'c', icon: 'help-outline', label: 'Lapor ke guru saja',       sub: 'Biar guru yang urus',          color: C.surfaceContainerHighest, iconColor: C.onSurfaceVariant },
        ],
        correctId: 'b',
      },
    ],
  },
};


// ── Choice card component ─────────────────────────────────────────────────────
function ChoiceCard({ choice, selected, onSelect, disabled, customStyle }) {
  const isSelected = selected === choice.id;
  return (
    <Pressable
      onPress={() => !disabled && onSelect(choice.id)}
      style={({ pressed }) => [
        styles.choiceCard,
        { backgroundColor: choice.color },
        isSelected && styles.choiceCardSelected,
        pressed && !disabled && { opacity: 0.85 },
        customStyle,
      ]}
    >
      <View style={[styles.choiceIconWrap, { backgroundColor: 'rgba(255,255,255,0.6)' }]}>
        <MaterialIcons name={choice.icon} size={22} color={choice.iconColor} />
      </View>
      <View style={styles.choiceTextWrap}>
        <Text style={styles.choiceLabel}>{choice.label}</Text>
        <Text style={styles.choiceSub}>{choice.sub}</Text>
      </View>
      {isSelected && (
        <View style={styles.selectedDot}>
          <MaterialIcons name="check" size={14} color="#fff" />
        </View>
      )}
    </Pressable>
  );
}

// ── Page dots ─────────────────────────────────────────────────────────────────
function PageDots({ total, current }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === current ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function OnMisiScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const misiId = Number(params.id) || 3;
  const data = MISI_SCENARIOS[misiId] ?? MISI_SCENARIOS[3];
  const scenes = data.scenes;

  const [sceneIndex, setSceneIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const scene = scenes[sceneIndex];
  const isLast = sceneIndex === scenes.length - 1;
  const isCorrect = selected === scene.correctId;
  const misiLabel = `MISI ${String(misiId).padStart(2, '0')}`;

  function handleSelect(id) {
    if (showFeedback) return;
    setSelected(id);
    setShowFeedback(true);
  }

  function handleNext() {
    if (!showFeedback) return;
    if (isLast) {
      router.push('/misi');
    } else {
      setSceneIndex((prev) => prev + 1);
      setSelected(null);
      setShowFeedback(false);
      setShowHint(false);
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={20} color={C.onSurface} />
        </Pressable>
        <View style={styles.headerTitleChip}>
          <Text style={styles.headerTitleText}>Kisah PancaGo!</Text>
        </View>
        <Pressable 
          style={[styles.backBtn, showHint && { backgroundColor: C.primary }]} 
          onPress={() => setShowHint(!showHint)}
        >
          <MaterialIcons name="lightbulb" size={20} color={showHint ? '#fff' : C.onSurface} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── HERO IMAGE ────────────────────────────────────────────────── */}
        <View style={styles.heroWrapper}>
          <Image
            source={{ uri: data.heroUri }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* Misi badge */}
          <View style={styles.misiBadge}>
            <Text style={styles.misiBadgeText}>{misiLabel}</Text>
          </View>
        </View>

        {/* ── SCENARIO LABEL ────────────────────────────────────────────── */}
        {showHint && (
          <View style={styles.hintContainer}>
            <Text style={styles.hintTitle}>Petunjuk 💡</Text>
            <Text style={styles.hintBody}>{scene.hint}</Text>
          </View>
        )}

        {/* ── QUESTION ──────────────────────────────────────────────────── */}
        <Text style={styles.question}>{scene.question}</Text>

        {/* ── CHOICES ───────────────────────────────────────────────────── */}
        <View style={styles.choiceList}>
          {scene.choices.map((choice) => {
            const isCorrectChoice = choice.id === scene.correctId;
            const isSelected = selected === choice.id;
            let cardStyle = {};
            if (showFeedback) {
              if (isCorrectChoice) cardStyle = { borderColor: '#4CAF50', borderWidth: 2 };
              else if (isSelected) cardStyle = { borderColor: '#E53935', borderWidth: 2, opacity: 0.7 };
              else cardStyle = { opacity: 0.5 };
            }

            return (
              <ChoiceCard
                key={choice.id}
                choice={choice}
                selected={selected}
                onSelect={handleSelect}
                disabled={showFeedback}
                customStyle={cardStyle}
              />
            );
          })}
        </View>

        {showFeedback && (
          <View style={[styles.feedbackBox, { backgroundColor: isCorrect ? '#E8F5E9' : '#FFEBEE' }]}>
            <View style={styles.feedbackHeader}>
               <MaterialIcons 
                 name={isCorrect ? "check-circle" : "cancel"} 
                 size={24} 
                 color={isCorrect ? "#4CAF50" : "#E53935"} 
               />
               <Text style={[styles.feedbackTitle, { color: isCorrect ? "#2E7D32" : "#C62828" }]}>
                 {isCorrect ? 'Benar!' : 'Kurang Tepat'}
               </Text>
            </View>
            <Text style={styles.feedbackText}>{scene.explanation}</Text>
          </View>
        )}

        {/* ── HINT TEXT ─────────────────────────────────────────────────── */}
        <Text style={styles.hintText}>PILIH DENGAN BIJAK, PETUALANG!</Text>

        {/* ── PAGE DOTS ─────────────────────────────────────────────────── */}
        <PageDots total={scenes.length} current={sceneIndex} />
      </ScrollView>

      {/* ── NEXT / FINISH BUTTON ──────────────────────────────────────── */}
      {selected && (
        <View style={[styles.nextBtnWrap, { paddingBottom: insets.bottom + 16 }]}>
          <Pressable
            style={({ pressed }) => [styles.nextBtn, pressed && { opacity: 0.88 }]}
            onPress={handleNext}
          >
            <Text style={styles.nextBtnText}>
              {isLast ? '🎉  Selesaikan Misi!' : 'Lanjutkan  →'}
            </Text>
          </Pressable>
        </View>
      )}
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
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.white90,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitleChip: {
    backgroundColor: C.white90,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  headerTitleText: {
    fontSize: 17,
    fontWeight: '800',
    color: C.onSurface,
    letterSpacing: 0.2,
  },

  // SCROLL
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 0,
  },

  // HERO
  heroWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    width: '100%',
    height: SW * 0.55,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 5,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  misiBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: C.amber,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  misiBadgeText: {
    fontSize: 15,
    fontWeight: '900',
    color: C.primary,
    letterSpacing: 0.5,
  },

  // SCENARIO LABEL
  scenarioLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.35)',
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 24,
  },
  scenarioLabelText: {
    fontSize: 13,
    fontWeight: '800',
    color: C.secondary,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },

  // QUESTION
  question: {
    fontSize: 25,
    fontWeight: '900',
    color: C.onSurface,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 32,
    letterSpacing: -0.3,
  },

  // CHOICES
  choiceList: {
    gap: 12,
    marginBottom: 32,
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  choiceCardSelected: {
    borderColor: C.primary,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  choiceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceTextWrap: {
    flex: 1,
  },
  choiceLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: C.onSurface,
  },
  choiceSub: {
    fontSize: 14,
    fontWeight: '600',
    color: C.onSurfaceVariant,
    marginTop: 2,
  },
  selectedDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // HINT + DOTS
  hintText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '800',
    color: C.secondary + 'BB',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: C.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },

  // NEXT BUTTON
  nextBtnWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: C.bg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.25)',
  },
  nextBtn: {
    backgroundColor: C.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: C.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  nextBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  // FEEDBACK
  feedbackBox: {
    padding: 18,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  feedbackText: {
    fontSize: 16,
    color: C.onSurfaceVariant,
    lineHeight: 22,
    fontWeight: '500',
  },

  // HINT
  hintContainer: {
    backgroundColor: '#FFF9C4',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FBC02D',
    marginBottom: 24,
  },
  hintTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F57F17',
    marginBottom: 4,
  },
  hintBody: {
    fontSize: 15,
    color: '#5D4037',
    lineHeight: 20,
  },
});
