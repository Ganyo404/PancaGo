import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
  surface: '#FAFAF3',
  surfaceContainerLowest: '#FFFFFF',
  onSurface: '#1B1C18',
  onSurfaceVariant: '#44483D',
  white90: 'rgba(255,255,255,0.90)',
  salmon: '#E8957A',
  amber: '#F5C842',
};

// ── Misi data ────────────────────────────────────────────────────────────────
const MISI_DATA = [
  {
    id: 1,
    silaLabel: 'Sila ke-1: Ketuhanan Yang Maha Esa',
    title: 'Misi 1: Puncak Religi',
    description:
      'Jelajahi keberagaman agama dan kepercayaan di Indonesia. Temukan keindahan toleransi dan penghormatan antar umat beragama!',
    xp: 100,
    heroUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC3Y9WLGIMijE0jFM6VHrGiT9LkecbNPb4gOFtaIyBPzVYa8bZf52-k5Kfqfb28VPf_HJgVm5p9KX3FKx2eZ4QvujO50Hs4dHBDDj-7t40lz4B9JqY18XBFHWI0RsPKL9z-XeW_5v_jX1_iBxKilVDFYCFNDPWLYGFOE5GX3dVCxWm9qidj1Dw2D6KVQnLTMJlqQhRK_wBidyNRz1iH8v8UtlNuFc3-kX8vI2I1YaD4ltnXQ6aFNO5k9FTyNWHHJkfHIVSDq1VY',
    tasks: [
      { id: 'a', icon: 'menu-book', label: 'Belajar nilai Ketuhanan', color: C.tertiaryContainer, iconColor: C.tertiary },
      { id: 'b', icon: 'handshake', label: 'Toleransi antar agama', color: '#FDDECF', iconColor: C.salmon },
      { id: 'c', icon: 'place', label: 'Kunjungi tempat ibadah', subLabel: 'Wisata religi', color: C.amber + '55', iconColor: '#B08700' },
    ],
  },
  {
    id: 2,
    silaLabel: 'Sila ke-2: Kemanusiaan yang Adil dan Beradab',
    title: 'Misi 2: Desa Beradab',
    description:
      'Temukan makna kemanusiaan sejati melalui petualangan di Desa Beradab. Pelajari pentingnya keadilan dan peradaban dalam kehidupan sehari-hari!',
    xp: 125,
    heroUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBqr4YhiMREiwWe4j0WU4oVg3aK-iMWjQHX4MDPuBjl_HMpGz6X5dVAuKWEIqvf_cPM-n2v91WpJNj4RzCHnKQ6OwQoFVWnQ9q6N3Nj4N3ZGWlAuJd8xDEPCBGz-bYfVPJSlJJYlEMuY9xCBQsHoZUxP2VzXf0FzH1mJzXKHnTVVaAX7GGEUfJkHkJIqbUHRt-kSHzlvomFMkOLmI-cCbq1dvq0fJBJf8UtgUuwDjb2dOJlkSTEWY_iS6sO7mPHAqT36M_vFsco',
    tasks: [
      { id: 'a', icon: 'favorite', label: 'Peduli sesama manusia', color: '#FDDECF', iconColor: C.salmon },
      { id: 'b', icon: 'balance', label: 'Belajar keadilan sosial', color: C.tertiaryContainer, iconColor: C.tertiary },
      { id: 'c', icon: 'group', label: 'Menghargai hak orang lain', subLabel: 'HAM & Martabat', color: C.amber + '55', iconColor: '#B08700' },
    ],
  },
  {
    id: 3,
    silaLabel: 'Sila ke-3: Persatuan Indonesia',
    title: 'Misi 3: Persatuan Rimba',
    description:
      'Bersama teman-teman baru, kamu akan belajar cara bekerja sama untuk menjaga keindahan Hutan Nusantara. Ayo tunjukkan semangat persatuanmu!',
    xp: 150,
    heroUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDbo7LcxIWuFnw-gNiTYSezp2-SOPrwlXCwWklGnRz1ySMrP8EsXU8MKVTcJgCOTkSJnlluDG2OrLc7VkwdimHtf5HlQh-9RWSET6Zgr95c0eKEhdLZnPMoOTbJpke-dgvFEWkoJJWbe67Izf22sa5t5MgVjCF07hZv_Dj0LXHLAUR6FbdIa7XcqV9FWK5ku0mxBGD6EGCehLyxfiChO21Bq2Mdgz3zx7zapWWiXbYevSIcYR6p9pSMtnnqiruc-5CFWFbBFfHwsGs',
    tasks: [
      { id: 'a', icon: 'forest', label: 'Menjaga alam bersama', color: C.tertiaryContainer, iconColor: C.tertiary },
      { id: 'b', icon: 'handshake', label: 'Saling membantu teman', color: '#FDDECF', iconColor: C.salmon },
      { id: 'c', icon: 'groups', label: 'Menghargai perbedaan', subLabel: 'Bhinneka Tunggal Ika', color: C.amber + '55', iconColor: '#B08700' },
    ],
  },
  {
    id: 4,
    silaLabel: 'Sila ke-4: Kerakyatan yang Dipimpin oleh Hikmat',
    title: 'Misi 4: Lembah Gotong Royong',
    description:
      'Pelajari pentingnya musyawarah dan mufakat dalam menyelesaikan masalah bersama. Jadilah pemimpin yang bijaksana!',
    xp: 175,
    heroUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC3Y9WLGIMijE0jFM6VHrGiT9LkecbNPb4gOFtaIyBPzVYa8bZf52-k5Kfqfb28VPf_HJgVm5p9KX3FKx2eZ4QvujO50Hs4dHBDDj-7t40lz4B9JqY18XBFHWI0RsPKL9z-XeW_5v_jX1_iBxKilVDFYCFNDPWLYGFOE5GX3dVCxWm9qidj1Dw2D6KVQnLTMJlqQhRK_wBidyNRz1iH8v8UtlNuFc3-kX8vI2I1YaD4ltnXQ6aFNO5k9FTyNWHHJkfHIVSDq1VY',
    tasks: [
      { id: 'a', icon: 'record-voice-over', label: 'Bermusyawarah bersama', color: C.tertiaryContainer, iconColor: C.tertiary },
      { id: 'b', icon: 'how-to-vote', label: 'Menghargai keputusan bersama', color: '#FDDECF', iconColor: C.salmon },
      { id: 'c', icon: 'emoji-people', label: 'Gotong royong', subLabel: 'Kebersamaan & Mufakat', color: C.amber + '55', iconColor: '#B08700' },
    ],
  },
  {
    id: 5,
    silaLabel: 'Sila ke-5: Keadilan Sosial bagi Seluruh Rakyat Indonesia',
    title: 'Misi 5: Keadilan Sosial',
    description:
      'Wujudkan keadilan sosial dengan memahami hak dan kewajiban setiap warga negara. Berjuanglah untuk Indonesia yang lebih adil!',
    xp: 200,
    heroUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBqr4YhiMREiwWe4j0WU4oVg3aK-iMWjQHX4MDPuBjl_HMpGz6X5dVAuKWEIqvf_cPM-n2v91WpJNj4RzCHnKQ6OwQoFVWnQ9q6N3Nj4N3ZGWlAuJd8xDEPCBGz-bYfVPJSlJJYlEMuY9xCBQsHoZUxP2VzXf0FzH1mJzXKHnTVVaAX7GGEUfJkHkJIqbUHRt-kSHzlvomFMkOLmI-cCbq1dvq0fJBJf8UtgUuwDjb2dOJlkSTEWY_iS6sO7mPHAqT36M_vFsco',
    tasks: [
      { id: 'a', icon: 'volunteer-activism', label: 'Berbagi dengan sesama', color: C.tertiaryContainer, iconColor: C.tertiary },
      { id: 'b', icon: 'gavel', label: 'Belajar hak & kewajiban', color: '#FDDECF', iconColor: C.salmon },
      { id: 'c', icon: 'public', label: 'Peduli lingkungan sekitar', subLabel: 'Keadilan & Kesejahteraan', color: C.amber + '55', iconColor: '#B08700' },
    ],
  },
];

// ── Bottom tab data ──────────────────────────────────────────────────────────
const BOTTOM_TABS = [
  { id: 'mulai', icon: 'check-circle', label: 'MULAI' },
  { id: 'kuis',  icon: 'copy-all',    label: 'KUIS'  },
  { id: 'hadiah',icon: 'emoji-events', label: 'HADIAH' },
];

// ── Task item ────────────────────────────────────────────────────────────────
function TaskItem({ task }) {
  return (
    <View style={[styles.taskItem, { backgroundColor: task.color }]}>
      <View style={[styles.taskIconWrap, { backgroundColor: 'rgba(255,255,255,0.55)' }]}>
        <MaterialIcons name={task.icon} size={22} color={task.iconColor} />
      </View>
      <View style={styles.taskTextWrap}>
        <Text style={styles.taskLabel}>{task.label}</Text>
        {task.subLabel ? (
          <Text style={styles.taskSubLabel}>{task.subLabel}</Text>
        ) : null}
      </View>
    </View>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function IsiMisiScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const misiId = Number(params.id) || 3;
  const misi = MISI_DATA.find((m) => m.id === misiId) ?? MISI_DATA[2];

  const [activeTab, setActiveTab] = useState('mulai');

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 + insets.bottom }}
      >
        {/* ── HERO IMAGE ──────────────────────────────────────────────────── */}
        <View style={styles.heroWrapper}>
          <Image
            source={{ uri: misi.heroUri }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Gradient overlay at bottom of hero */}
          <LinearGradient
            colors={['transparent', C.bg + 'EE']}
            style={styles.heroGradient}
          />

          {/* Back button */}
          <Pressable
            style={[styles.backBtn, { top: insets.top + 12 }]}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={22} color={C.onSurface} />
          </Pressable>

          {/* More options */}
          <Pressable
            style={[styles.moreBtn, { top: insets.top + 12 }]}
          >
            <MaterialIcons name="more-vert" size={22} color={C.onSurface} />
          </Pressable>

          {/* XP badge */}
          <View style={styles.xpBadge}>
            <MaterialIcons name="star" size={14} color={C.primary} />
            <Text style={styles.xpText}>{misi.xp} XP</Text>
          </View>
        </View>

        {/* ── QUEST CARD ──────────────────────────────────────────────────── */}
        <View style={styles.questCard}>
          {/* Small mascot icon */}
          <View style={styles.mascotChip}>
            <MaterialIcons name="eco" size={20} color={C.primary} />
          </View>

          <Text style={styles.questActiveLabel}>QUEST AKTIF</Text>
          <Text style={styles.questTitle}>{misi.title}</Text>
          <Text style={styles.questSilaLabel}>{misi.silaLabel}</Text>
          <Text style={styles.questDesc}>{misi.description}</Text>
        </View>

        {/* ── TASK LIST ───────────────────────────────────────────────────── */}
        <View style={styles.taskList}>
          {misi.tasks.map((t) => (
            <TaskItem key={t.id} task={t} />
          ))}
        </View>
      </ScrollView>

      {/* ── BOTTOM TABS + CTA ────────────────────────────────────────────── */}
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + 8 }]}>
        {/* Three tabs */}
        <View style={styles.tabRow}>
          {BOTTOM_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={styles.tabItem}
              >
                <View style={[styles.tabIconWrap, isActive && styles.tabIconActive]}>
                  <MaterialIcons
                    name={tab.icon}
                    size={22}
                    color={isActive ? C.primary : C.onSurfaceVariant + '80'}
                  />
                </View>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* CTA Button */}
        <Pressable
          style={({ pressed }) => [styles.ctaBtn, pressed && { opacity: 0.88 }]}
          onPress={() => router.push(`/on-misi?id=${misiId}`)}
        >
          <LinearGradient
            colors={[C.primary, '#3A4F10']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <MaterialIcons name="play-arrow" size={22} color="#fff" />
            <Text style={styles.ctaText}>MULAI MISI</Text>
          </LinearGradient>
        </Pressable>
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

  // HERO
  heroWrapper: {
    width: SW,
    height: SW * 0.75,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  backBtn: {
    position: 'absolute',
    left: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.white90,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  moreBtn: {
    position: 'absolute',
    right: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.white90,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  xpBadge: {
    position: 'absolute',
    top: 14,
    right: 62,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: C.amber,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  xpText: {
    fontWeight: '800',
    fontSize: 16,
    color: C.primary,
  },

  // QUEST CARD
  questCard: {
    backgroundColor: C.white90,
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: -24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  mascotChip: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: C.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  questActiveLabel: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.8,
    color: C.secondary,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  questTitle: {
    fontSize: 27,
    fontWeight: '900',
    color: C.onSurface,
    letterSpacing: -0.4,
    lineHeight: 32,
    marginBottom: 6,
  },
  questSilaLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: C.secondary,
    marginBottom: 14,
  },
  questDesc: {
    fontSize: 16,
    color: C.onSurfaceVariant,
    lineHeight: 21,
    fontWeight: '500',
  },

  // TASK LIST
  taskList: {
    marginHorizontal: 16,
    marginTop: 20,
    gap: 12,
    marginBottom: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  taskIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTextWrap: {
    flex: 1,
  },
  taskLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: C.onSurface,
  },
  taskSubLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: C.onSurfaceVariant,
    marginTop: 2,
  },

  // BOTTOM SHEET
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.white90,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.4)',
    gap: 16,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    gap: 3,
    flex: 1,
  },
  tabIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconActive: {
    backgroundColor: C.primaryContainer,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: C.onSurfaceVariant + '80',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  tabLabelActive: {
    color: C.primary,
  },

  // CTA BUTTON
  ctaBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: C.primary,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  ctaText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 1,
  },
});
