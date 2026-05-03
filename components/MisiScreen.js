import React from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserStore } from '../store/useUserStore';
import { useProgressStore } from '../store/useProgressStore';
import { MISI_NODES } from '../assets/data/misiData';
import { getCharacter } from '../constants/characters';

const { width: SW } = Dimensions.get('window');
const MAP_H = 5000;

const C = {
  bg: '#ABC270',
  primary: '#52651E',
  primaryContainer: '#D4E8A0',
  secondary: '#5E6644',
  secondaryContainer: '#E3E9C6',
  onSurface: '#1B1C18',
  onSurfaceVariant: '#44483D',
  white90: 'rgba(255,255,255,0.90)',
  cardBg: 'rgba(255,255,255,0.85)',
  doneCircle: '#E8957A',
  lockedCircle: '#D0D4C8',
};

// MASCOT dihapus karena avatar sudah dinamis

// NODES sekarang dari misiData.js via useProgressStore

function buildPath(nodes) {
  const pts = nodes.map((n) => ({ x: n.xR * SW, y: n.y }));
  const segs = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const dy = Math.abs(a.y - b.y);
    const cy1 = a.y - dy * 0.45;
    const cy2 = b.y + dy * 0.45;
    segs.push(`C ${a.x},${cy1} ${b.x},${cy2} ${b.x},${b.y}`);
  }
  return `M ${pts[0].x},${pts[0].y} ${segs.join(' ')}`;
}

// ── Single map node ──────────────────────────────────────────────────────────
function MapNode({ node, onPress, avatarUri }) {
  const CIRCLE = node.active ? 80 : 60;
  const cx = node.xR * SW;
  const LABEL_W = 148;

  // Label position offset from node center
  let labelStyle = {};
  if (node.label === 'below') {
    labelStyle = { left: cx - LABEL_W / 2, top: node.y + CIRCLE / 2 + 10 };
  } else if (node.label === 'right') {
    labelStyle = { left: cx + CIRCLE / 2 + 8, top: node.y - 28 };
  } else {
    // left
    labelStyle = { left: cx - CIRCLE / 2 - LABEL_W - 8, top: node.y - 28 };
  }

  return (
    <>
      {/* ── Circle ── */}
      <Pressable
        onPress={() => !node.locked && onPress(node.id)}
        style={({ pressed }) => [
          styles.nodeCircle,
          {
            width: CIRCLE,
            height: CIRCLE,
            borderRadius: CIRCLE / 2,
            position: 'absolute',
            left: cx - CIRCLE / 2,
            top: node.y - CIRCLE / 2,
            backgroundColor: node.active
              ? C.primary
              : node.done
              ? C.doneCircle
              : C.lockedCircle,
            borderWidth: node.active ? 4 : 0,
            borderColor: node.active ? C.primaryContainer : 'transparent',
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        {node.active ? (
          <Image source={avatarUri} style={styles.mascotThumb} resizeMode="cover" />
        ) : node.done ? (
          <MaterialIcons name="check" size={22} color="#fff" />
        ) : (
          <MaterialIcons name="lock" size={20} color="#fff" />
        )}
      </Pressable>

      {/* ── Label card ── */}
      <Pressable
        onPress={() => !node.locked && onPress(node.id)}
        style={[
          styles.labelCard,
          { position: 'absolute', width: LABEL_W, ...labelStyle },
          node.active && styles.labelCardActive,
        ]}
      >
        <Text style={[styles.silaTag, node.active && { color: '#fff' }]}>
          {node.silaLabel}
        </Text>
        <Text style={[styles.nodeName, node.active && { color: '#fff' }]}>
          {node.name}
        </Text>
      </Pressable>
    </>
  );
}

// ── NavItem ───────────────────────────────────────────────────────────────────
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

// ── Main MisiScreen ──────────────────────────────────────────────────────────
export default function MisiScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { points, equippedCharId, name } = useUserStore();
  const { isNodeDone, isNodeUnlocked } = useProgressStore();

  const avatarUri = getCharacter(equippedCharId)?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuByiFa9FqNjUiekBPiMxEo06K6KQQWZPOAE5fHKj4pq8lndiIini3kgzldOUBkvdyRWFAiDf-s6tZCQfMJyqEelR2goR7Nju-QmT8vM06PjFeiLP2iYB0tQQT0LGLUak1cSPFSIjuLRi-qT81Yc8BiG3imqYdupv2zc19mGcnHHBFF1HDeHierTpDqyHkw0cYJ9VA2aqmqvI5i9iecZXspT7M4FgudnLSJY94qNL5yRX-jnK6gf0bnnpFNhwZo6IWM3KhRdmPSr0NM';

  // Bangun NODES: unlock satu-per-satu dari bawah ke atas (node 1 dulu, setelah selesai node 2, dst)
  const NODES = MISI_NODES.map((node) => ({
    ...node,
    done:   isNodeDone(node.id),
    locked: !isNodeUnlocked(node.id),
    active: isNodeUnlocked(node.id) && !isNodeDone(node.id),
  }));

  const pathD = buildPath(NODES);

  // Temukan node aktif (terbuka tapi belum selesai) = misi yang perlu dikerjakan
  const activeNode = NODES.find((n) => n.active) ?? NODES[NODES.length - 1];

  return (
    <View style={styles.container}>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.push('/profil')} style={styles.headerLeft}>
          <Image source={avatarUri} style={styles.headerAvatar} />
          <Text style={styles.headerTitle}>Pagi {name}!</Text>
        </Pressable>
        <View style={styles.pointsBadge}>
          <MaterialIcons name="stars" size={16} color={C.secondary} />
          <Text style={styles.pointsText}>{points.toLocaleString('id-ID')} Pts</Text>
        </View>
      </View>

      {/* ── SCROLLABLE MAP ───────────────────────────────────────────────── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 + insets.bottom }}>

        {/* Section heading */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Peta Nusantara</Text>
          <Text style={styles.sectionSub}>{'Selesaikan misi untuk membuka Sila\nberikutnya!'}</Text>
        </View>

        {/* Map container */}
        <LinearGradient
          colors={['#9DB85A', '#C8D99A', '#E8F0D0', '#F5F8EC']}
          locations={[0, 0.35, 0.7, 1]}
          style={[styles.mapArea, { height: MAP_H }]}
        >
          {/* Decorative — pine tree top-left */}
          <MaterialIcons
            name="park"
            size={56}
            color={C.primary}
            style={{ position: 'absolute', left: 14, top: 80, opacity: 0.40 }}
          />

          {/* Decorative — small pine bottom-left */}
          <MaterialIcons
            name="park"
            size={36}
            color={C.primary}
            style={{ position: 'absolute', left: 30, top: 740, opacity: 0.25 }}
          />

          {/* Decorative — mountains right-center */}
          <MaterialIcons
            name="terrain"
            size={64}
            color={C.secondary}
            style={{ position: 'absolute', right: 10, top: 470, opacity: 0.25 }}
          />
          <MaterialIcons
            name="terrain"
            size={44}
            color={C.secondary}
            style={{ position: 'absolute', right: 48, top: 496, opacity: 0.15 }}
          />

          {/* Dashed SVG path */}
          <Svg
            width={SW}
            height={MAP_H}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
          >
            <Path
              d={pathD}
              stroke={C.primary}
              strokeWidth={2.5}
              strokeDasharray="10 9"
              strokeLinecap="round"
              fill="none"
              opacity={0.55}
            />
          </Svg>

          {/* Nodes */}
          {NODES.map((n) => (
            <MapNode
              key={n.id}
              node={n}
              onPress={(id) => router.push(`/isi-misi?id=${id}`)}
              avatarUri={avatarUri}
            />
          ))}
        </LinearGradient>
      </ScrollView>

      {/* ── FAB ──────────────────────────────────────────────────────────── */}
      <Pressable
        style={[styles.fab, { bottom: 90 + insets.bottom }]}
        onPress={() => router.push(`/isi-misi?id=${activeNode.id}`)}
      >
        <MaterialIcons name="rocket-launch" size={26} color="#fff" />
      </Pressable>

      {/* ── BOTTOM NAV ───────────────────────────────────────────────────── */}
      <View style={[styles.navbar, { paddingBottom: insets.bottom + 8 }]}>
        <NavItem icon="home"      label="Home"     onPress={() => router.push('/home')} />
        <NavItem icon="extension" label="Quiz"     onPress={() => router.push('/quiz')} />
        <NavItem icon="face"      label="Karakter" onPress={() => router.push('/karakter')} />
        <NavItem icon="map"       label="Misi"     active onPress={() => router.push('/misi')} />
        <NavItem icon="person"    label="Profil"   onPress={() => router.push('/profil')} />
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: C.white90,
    gap: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 },
  headerAvatar: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 2, borderColor: C.primary,
  },
  headerTitle: { fontSize: 21, fontWeight: '800', color: C.primary, letterSpacing: -0.3 },
  pointsBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.secondaryContainer,
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  pointsText: { fontWeight: '800', fontSize: 16, color: C.onSurface },

  // SECTION HEAD
  sectionHead: { paddingHorizontal: 24, paddingVertical: 20, gap: 4 },
  sectionTitle: { fontSize: 31, fontWeight: '900', color: C.onSurface, letterSpacing: -0.5 },
  sectionSub: { fontSize: 16, color: C.onSurfaceVariant, fontWeight: '500', lineHeight: 19 },

  // MAP
  mapArea: { width: SW, overflow: 'hidden' },

  // NODE CIRCLE
  nodeCircle: {
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, elevation: 4,
  },
  mascotThumb: { width: '100%', height: '100%', borderRadius: 999 },

  // LABEL CARD
  labelCard: {
    backgroundColor: C.cardBg,
    borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)',
  },
  labelCardActive: { backgroundColor: C.primary },
  silaTag: {
    fontSize: 12, fontWeight: '800', color: C.onSurfaceVariant,
    textTransform: 'uppercase', letterSpacing: 1.2,
  },
  nodeName: { fontSize: 16, fontWeight: '800', color: C.onSurface, marginTop: 2 },

  // FAB
  fab: {
    position: 'absolute', right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: C.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: C.primary, shadowOpacity: 0.45, shadowRadius: 12, elevation: 8,
  },

  // NAVBAR
  navbar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    paddingTop: 10, backgroundColor: C.white90,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, elevation: 12,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.3)',
  },
  navItem: {
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, gap: 2,
  },
  navItemActive: { backgroundColor: C.bg },
  navItemPressed: { backgroundColor: C.bg + '40' },
  navLabel: {
    fontSize: 13, fontWeight: '700', color: C.secondary + '99',
    textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 2,
  },
  navLabelActive: { color: C.onSurface },
});
