import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCharacter } from '../constants/characters';

const { width: SW, height: SH } = Dimensions.get('window');

const C = {
  bg: '#ABC270',
  primary: '#52651E',
  primaryContainer: '#D4E8A0',
  secondary: '#5E6644',
  secondaryContainer: '#E3E9C6',
  onSurface: '#1B1C18',
  onSurfaceVariant: '#44483D',
  surface: '#FFFFFF',
  brown: '#564334',
};

export default function ChooseKarakterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const char = getCharacter(id);

  if (!char) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 19 }}>Karakter tidak ditemukan.</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: '#fff', textDecorationLine: 'underline' }}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* ── Top controls ───────────────────────────────────────────────────── */}
      <View style={styles.topRow}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.75 }]}
          onPress={() => router.back()}
        >
          <MaterialIcons name="chevron-left" size={26} color={C.onSurface} />
        </Pressable>

        <View style={styles.pointsBadge}>
          <MaterialIcons name="stars" size={16} color="#C97D10" />
          <Text style={styles.pointsText}>1,250 Pts</Text>
        </View>
      </View>

      {/* ── Edition badge ──────────────────────────────────────────────────── */}
      {char.edition && (
        <View style={styles.editionBadge}>
          <Text style={styles.editionText}>{char.edition}</Text>
        </View>
      )}

      {/* ── Character image ────────────────────────────────────────────────── */}
      <View style={styles.imageCard}>
        <Image
          source={char.image}
          style={[styles.charImage, char.locked && { opacity: 0.5 }]}
          resizeMode="contain"
        />
        {char.locked && (
          <View style={styles.lockOverlay}>
            <MaterialIcons name="lock" size={36} color="rgba(255,255,255,0.9)" />
          </View>
        )}
      </View>

      {/* ── Name & rarity ─────────────────────────────────────────────────── */}
      <Text style={styles.charName}>{char.name}</Text>
      <Text style={styles.charRarity}>
        {char.category}
        <Text style={{ color: 'rgba(255,255,255,0.5)' }}> • </Text>
        <Text style={{ color: char.rarityColor === C.primary ? '#D4E8A0' : '#fff', fontWeight: '900' }}>
          {char.rarity}
        </Text>
      </Text>

      {/* ── Bottom sheet ───────────────────────────────────────────────────── */}
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>

        {/* Bonus card */}
        <View style={styles.bonusCard}>
          <View style={styles.bonusIconWrap}>
            <MaterialIcons name={char.bonusIcon} size={26} color={C.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bonusTitle}>{char.bonusTitle}</Text>
            <Text style={styles.bonusDesc}>{char.bonusDesc}</Text>
          </View>
        </View>

        {/* CTA button */}
        {char.locked ? (
          <Pressable
            style={({ pressed }) => [styles.ctaLocked, pressed && { opacity: 0.82 }]}
          >
            <MaterialIcons name="lock" size={20} color="#fff" />
            <Text style={styles.ctaLockedText}>{char.pts.toLocaleString('id-ID')} Pts diperlukan</Text>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.ctaUnlocked, pressed && { opacity: 0.85 }]}
          >
            <MaterialIcons name="face" size={22} color="#fff" />
            <Text style={styles.ctaUnlockedText}>GUNAKAN</Text>
          </Pressable>
        )}

        {/* Secondary button */}
        <Pressable style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.75 }]}>
          <Text style={styles.secondaryBtnText}>Detail Karakter</Text>
        </Pressable>

        {/* Footer */}
        <Text style={styles.footer}>{char.requirement}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg, alignItems: 'center' },

  // TOP ROW
  topRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', width: '100%',
    paddingHorizontal: 20, paddingVertical: 12,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
  },
  pointsBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.88)',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
  },
  pointsText: { fontWeight: '800', fontSize: 16, color: C.onSurface },

  // EDITION BADGE
  editionBadge: {
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 18, paddingVertical: 6, borderRadius: 999, marginBottom: 10,
  },
  editionText: {
    fontSize: 14, fontWeight: '900', color: '#fff', letterSpacing: 1.5,
  },

  // IMAGE CARD
  imageCard: {
    width: SW - 40, height: SW - 40,
    maxWidth: 320, maxHeight: 320,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20, elevation: 8,
    marginBottom: 18,
  },
  charImage: { width: '90%', height: '90%' },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },

  // NAME & RARITY
  charName: {
    fontSize: 37, fontWeight: '900', color: '#fff',
    letterSpacing: -0.5, textAlign: 'center',
  },
  charRarity: {
    fontSize: 16, fontWeight: '700', color: 'rgba(255,255,255,0.85)',
    marginTop: 4, marginBottom: 16, textAlign: 'center',
  },

  // BOTTOM SHEET
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: C.surface,
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingHorizontal: 24, paddingTop: 28, gap: 14,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 24, elevation: 12,
  },

  // BONUS CARD
  bonusCard: {
    backgroundColor: C.primaryContainer,
    borderRadius: 18, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  bonusIconWrap: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  bonusTitle: { fontSize: 18, fontWeight: '900', color: C.onSurface },
  bonusDesc: { fontSize: 15, color: C.onSurfaceVariant, marginTop: 3, lineHeight: 17 },

  // CTA BUTTONS
  ctaUnlocked: {
    backgroundColor: C.brown, borderRadius: 999,
    paddingVertical: 18, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 10,
    shadowColor: C.brown, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6,
  },
  ctaUnlockedText: { fontSize: 21, fontWeight: '900', color: '#fff', letterSpacing: 1 },

  ctaLocked: {
    backgroundColor: C.secondary, borderRadius: 999,
    paddingVertical: 18, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 10,
    shadowColor: C.secondary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4,
  },
  ctaLockedText: { fontSize: 19, fontWeight: '800', color: '#fff' },

  secondaryBtn: {
    backgroundColor: '#F2F3ED', borderRadius: 999,
    paddingVertical: 16, alignItems: 'center', justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: 18, fontWeight: '700', color: C.onSurface },

  footer: {
    fontSize: 14, color: C.onSurfaceVariant, textAlign: 'center',
    paddingHorizontal: 8,
  },
});
