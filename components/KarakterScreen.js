import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CHARACTERS, getCharacter } from '../constants/characters';
import { useUserStore } from '../store/useUserStore';

const { width: SW } = Dimensions.get('window');
const CARD_SIZE = (SW - 40 - 12) / 2; // 2-column grid with 12px gap

// ── Colour tokens (shared with all screens) ──────────────────────────────────
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

// CHARACTERS is now imported from ../constants/characters

// ── Character Card ────────────────────────────────────────────────────────────
function CharacterCard({ char, onPress }) {
  const ptsLabel = char.pts ? `${char.pts.toLocaleString('id-ID')} Pts` : '';

  if (char.locked) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, styles.cardLocked, pressed && { opacity: 0.82, transform: [{ scale: 0.97 }] }]}
      >
        <View style={styles.imgWrap}>
          <Image source={char.image} style={styles.cardImg} resizeMode="cover" />
          <View style={styles.lockedOverlay} />
        </View>
        <View style={styles.lockBadge}>
          <MaterialIcons name="lock" size={11} color="#fff" />
          <Text style={styles.lockBadgeText}>{ptsLabel}</Text>
        </View>
        <Text style={styles.cardNameLocked}>???</Text>
        <Text style={styles.cardDesc}>Terkunci</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, styles.cardUnlocked, pressed && { opacity: 0.88, transform: [{ scale: 0.97 }] }]}
    >
      <View style={styles.imgWrap}>
        <Image source={char.image} style={styles.cardImg} resizeMode="cover" />
      </View>
      <View style={styles.terbukaBadge}>
        <Text style={styles.terbukaBadgeText}>TERBUKA</Text>
      </View>
      <Text style={styles.cardName}>{char.name}</Text>
      <Text style={styles.cardDesc}>{char.desc}</Text>
    </Pressable>
  );
}

// ── "Cari Lebih Banyak" placeholder card ─────────────────────────────────────
function MoreCard() {
  return (
    <View style={styles.moreCard}>
      <MaterialIcons name="add" size={32} color={C.primary} />
      <Text style={styles.moreCardText}>{'CARI LEBIH\nBANYAK'}</Text>
    </View>
  );
}

// ── Bottom Nav item ───────────────────────────────────────────────────────────
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

// ── Main KarakterScreen ───────────────────────────────────────────────────────
export default function KarakterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { points, ownedCharIds, equippedCharId, buyCharacter } = useUserStore();
  const avatarUri = getCharacter(equippedCharId)?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuByiFa9FqNjUiekBPiMxEo06K6KQQWZPOAE5fHKj4pq8lndiIini3kgzldOUBkvdyRWFAiDf-s6tZCQfMJyqEelR2goR7Nju-QmT8vM06PjFeiLP2iYB0tQQT0LGLUak1cSPFSIjuLRi-qT81Yc8BiG3imqYdupv2zc19mGcnHHBFF1HDeHierTpDqyHkw0cYJ9VA2aqmqvI5i9iecZXspT7M4FgudnLSJY94qNL5yRX-jnK6gf0bnnpFNhwZo6IWM3KhRdmPSr0NM';

  const [selectedChar, setSelectedChar] = useState(null);
  const [poseIndex, setPoseIndex] = useState(0);

  // Animasi pergantian pose
  useEffect(() => {
    let interval;
    if (selectedChar && selectedChar.poses && selectedChar.poses.length > 0) {
      interval = setInterval(() => {
        setPoseIndex((prev) => (prev + 1) % selectedChar.poses.length);
      }, 800); // ganti gambar setiap 800ms
    }
    return () => clearInterval(interval);
  }, [selectedChar]);

  const handleCardPress = (char) => {
    setSelectedChar(char);
    setPoseIndex(0);
  };

  const handleAction = () => {
    if (!selectedChar) return;
    const isOwned = ownedCharIds.includes(selectedChar.id);

    if (selectedChar.locked && !isOwned) {
      // Proses beli
      const ok = buyCharacter(selectedChar.id, selectedChar.pts || 0);
      if (!ok) {
        Alert.alert('Poin Tidak Cukup', 'Selesaikan kuis untuk kumpul poin!');
      } else {
        Alert.alert('Berhasil!', `${selectedChar.name} sekarang milikmu.`);
      }
    } else {
      // Pakai karakter
      buyCharacter(selectedChar.id, 0);
      Alert.alert('Dipakai!', `${selectedChar.name} telah digunakan sebagai avatarmu.`);
    }
  };

  const closeModal = () => setSelectedChar(null);

  // Render grid: pairs of cards (2 per row)
  const rows = [];
  const cards = [...CHARACTERS];
  // add "more" slot at end
  while (cards.length % 2 !== 0) cards.push({ id: 'more', more: true });
  if (cards.length % 2 === 0) cards.push({ id: 'more', more: true });

  for (let i = 0; i < cards.length; i += 2) {
    rows.push([cards[i], cards[i + 1]]);
  }

  return (
    <View style={styles.container}>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>PancaGo!</Text>
        <View style={styles.pointsBadge}>
          <MaterialIcons name="stars" size={16} color={C.secondary} />
          <Text style={styles.pointsText}>{points.toLocaleString('id-ID')} Pts</Text>
        </View>
        <Pressable onPress={() => router.push('/profil')}>
          <Image
            source={avatarUri}
            style={styles.headerAvatar}
          />
        </Pressable>
      </View>

      {/* ── SCROLLABLE CONTENT ───────────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 110 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Section title */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Koleksi Karakter</Text>
          <Text style={styles.sectionSub}>Lengkapi semua teman petualanganmu!</Text>
        </View>

        {/* Character grid */}
        <View style={styles.grid}>
          {rows.map((row, ri) => (
            <View key={ri} style={styles.gridRow}>
              {row.map((item) =>
                item?.more ? (
                  <MoreCard key="more" />
                ) : item ? (
                  <CharacterCard
                    key={item.id}
                    char={{ ...item, locked: item.pts > 0 && !ownedCharIds.includes(item.id) }}
                    onPress={() => handleCardPress(item)}
                  />
                ) : null
              )}
            </View>
          ))}
        </View>

        {/* Collector mission card */}
        <View style={styles.missionCard}>
          <View style={styles.missionIconWrap}>
            <MaterialIcons name="emoji-events" size={26} color={C.secondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.missionTitle}>Misi Kolektor</Text>
            <Text style={styles.missionDesc}>
              {"Dapatkan 3 karakter lagi untuk\nmembuka Lencana 'Penjelajah Rimba'!"}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ── BOTTOM NAV ──────────────────────────────────────────────────────── */}
      <View style={[styles.navbar, { paddingBottom: insets.bottom + 8 }]}>
        <NavItem icon="home" label="Home" onPress={() => router.push('/home')} />
        <NavItem icon="extension" label="Quiz" onPress={() => router.push('/quiz')} />
        <NavItem icon="face" label="Karakter" active onPress={() => router.push('/karakter')} />
        <NavItem icon="map" label="Misi" onPress={() => router.push('/misi')} />
        <NavItem icon="person" label="Profil" onPress={() => router.push('/profil')} />
      </View>

      {/* ── MODAL ANIMASI KARAKTER ─────────────────────────────────────────── */}
      {selectedChar && (
        <Modal transparent animationType="fade" visible={!!selectedChar} onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Pressable style={styles.closeBtn} onPress={closeModal}>
                <MaterialIcons name="close" size={28} color="#1B1C1C" />
              </Pressable>
              
              <Text style={styles.modalTitle}>{selectedChar.name}</Text>
              <Text style={styles.modalDesc}>{selectedChar.desc}</Text>

              <View style={styles.modalImageWrap}>
                <Image 
                  source={selectedChar.poses ? selectedChar.poses[poseIndex] : selectedChar.image} 
                  style={styles.modalImage} 
                  resizeMode="contain" 
                />
              </View>

              <View style={styles.modalActionRow}>
                {(() => {
                  const isOwned = ownedCharIds.includes(selectedChar.id);
                  const isEquipped = equippedCharId === selectedChar.id;

                  if (isEquipped) {
                    return (
                      <View style={[styles.modalBtn, { backgroundColor: '#A0A0A0' }]}>
                        <Text style={styles.modalBtnText}>Sedang Dipakai</Text>
                      </View>
                    );
                  } else if (isOwned || !selectedChar.locked) {
                    return (
                      <Pressable style={styles.modalBtn} onPress={() => { handleAction(); closeModal(); }}>
                        <Text style={styles.modalBtnText}>Pakai Karakter</Text>
                      </Pressable>
                    );
                  } else {
                    return (
                      <Pressable style={styles.modalBtn} onPress={() => { handleAction(); closeModal(); }}>
                        <Text style={styles.modalBtnText}>Beli ({selectedChar.pts} Pts)</Text>
                      </Pressable>
                    );
                  }
                })()}
              </View>
            </View>
          </View>
        </Modal>
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
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: C.white90,
    gap: 10,
  },
  headerTitle: {
    flex: 1,
    fontSize: 23,
    fontWeight: '900',
    color: C.primary,
    letterSpacing: -0.5,
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
    fontSize: 16,
    color: C.onSurface,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: C.primary,
  },

  // SCROLL
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },

  // SECTION HEAD
  sectionHead: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 29,
    fontWeight: '900',
    color: C.onSurface,
    letterSpacing: -0.4,
  },
  sectionSub: {
    fontSize: 16,
    color: C.onSurfaceVariant,
    fontWeight: '500',
  },

  // GRID
  grid: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },

  // CHARACTER CARD — UNLOCKED
  card: {
    width: CARD_SIZE,
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  cardUnlocked: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  cardLocked: {
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  imgWrap: {
    width: CARD_SIZE - 24,
    height: CARD_SIZE - 24,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: C.surfaceContainerHighest,
  },
  cardImg: {
    width: '100%',
    height: '100%',
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(80,80,80,0.45)',
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#564334',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: 'center',
    marginTop: -8,
  },
  lockBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  terbukaBadge: {
    backgroundColor: C.primaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'center',
    marginTop: -8,
  },
  terbukaBadgeText: {
    fontSize: 13,
    fontWeight: '900',
    color: C.primary,
    letterSpacing: 0.8,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '900',
    color: C.onSurface,
    textAlign: 'center',
  },
  cardNameLocked: {
    fontSize: 18,
    fontWeight: '900',
    color: C.onSurfaceVariant,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 14,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    marginTop: -4,
  },

  // MORE CARD
  moreCard: {
    width: CARD_SIZE,
    height: CARD_SIZE + 68, // same height as a character card
    borderRadius: 20,
    borderWidth: 2,
    borderColor: C.primary + '50',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(212,232,160,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  moreCardText: {
    fontSize: 14,
    fontWeight: '900',
    color: C.primary,
    textAlign: 'center',
    letterSpacing: 0.8,
    lineHeight: 16,
  },

  // MISSION CARD
  missionCard: {
    backgroundColor: C.cardBg,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  missionIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: C.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: C.onSurface,
    marginBottom: 4,
  },
  missionDesc: {
    fontSize: 14,
    color: C.onSurfaceVariant,
    lineHeight: 16,
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
    fontSize: 13,
    fontWeight: '700',
    color: C.secondary + '99',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  navLabelActive: {
    color: C.onSurface,
  },

  // MODAL ANIMATION
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 4,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: C.primary,
    marginTop: 8,
  },
  modalDesc: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalImageWrap: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalActionRow: {
    width: '100%',
  },
  modalBtn: {
    backgroundColor: C.primary,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: C.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  modalBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
