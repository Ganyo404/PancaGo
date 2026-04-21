import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AVATARS = [
  {
    id: 1,
    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-FOFlzmgz9YSX7wiS-p1E9PMOUg88uOfW5Tc1Gnh_M-6Gf_xTsNG2d-S2VN6BkPDUk0Bj0_mTirqiKJPOUR-oZQShSjsAAkom3eqE3TkMoYAq6X3XM8_57TEEC5vAZBTqRAEG8RoJ0HZI6-1kUO-HTWHAhX59rlBrs-J93QNgaUApAg3Wy0XDd9sVzKlSvxS_w6hABo_CAApHdb_c5lY8y7rgJG5D2AaNpfBAk-kQ6ipX6cw1ee8Ly6DSOpsDuYsQ2QJGyjuuXkI',
  },
  {
    id: 2,
    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeRryuMzQLRuq8M-TkzV-Apg8Xo9n0C9_VfPA_qIAwXKleMccMVk-q9644P5CkHUIDFynnfO6S1Gz5KvyXTlhT6vd6f4JrheU6Oq26C2WUzksdFVcH1hj2YAOAka22S3IAqSAUQQg7e_8ebXe6bHrUSyCu_SPvVuhudUlaHIrczYvZKSEr0QxmFD7pnD3tr6J-5vzOQaFbPUmaTKu9Tj2UcEddCl8RLT3IdG5sHBZwVI-g0tjLDXApgLkC6R6Jm2kIyWmF62OTPKo',
  },
  {
    id: 3,
    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANVZGO8aCwqUdpbdnNlFKdwOBXFq99cthoNKZJUDDSi4_ScVDusXHhr9USpUrAKLrnAGYid41Vo7PePOG1pO7hfIilaWrbYrhkj37La_RE6MRC02vl9lhiBJtfcDHyNM-gkHV-Aa9GpbsPdrk6QWSozhiACtWHf3ahjlBxV2HfSiPcw2dV79LK67M9VtCw-HvatQU7ur49NISDx8gTMfE4TV5zjPMQ6qYUc5LhkHIMCssL7pRlMgJ_wEpoQNTaC0crN7ly-mNKN0k',
  },
  {
    id: 4,
    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4YqFK63amgxES5oZTh9h_fDEvRPnYEC51xm07QREZ3kymIluC5RiZfpJ36PlTWPamaJFIWujcweTDvp2Te5ZX9TLwfUbCkD-vczsfw0kx-fhvmiLqE_xbnwsWxV62lgRtCtj6mpcAT-BfenkrdmMYP9OKXcgPD2RDt1BLVcJGVj1boy8pWJfXvzJJoQ-VOtZyeLAAbqsz2S8FY9V1e0Zia2AgHFaCngFqzav_KAUub_4Lr3FLeHb-1OGl9vzIv4TDtfNreNTQmrs',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedAvatar, setSelectedAvatar] = useState(1);
  const [username, setUsername] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <View style={styles.headerArea}>
          {/* Star badge */}
          <View style={styles.starBadge}>
            <MaterialIcons name="star" size={24} color="#574500" />
          </View>

          <Text style={styles.title}>{'Yuk mulai\npetualangan\nbelajar!'}</Text>
          <Text style={styles.subtitle}>
            {'Buat profil serumu untuk menjelajahi\ndunia PancaGo!'}
          </Text>
        </View>

        {/* ── Form Card ────────────────────────────────────────────────────── */}
        <View style={styles.card}>

          {/* Name input */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabel}>
              <MaterialIcons name="edit" size={14} color="#6b8227" />
              <Text style={styles.fieldLabelText}>Nama Panggilan</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Siapa namamu?"
              placeholderTextColor="rgba(27,28,28,0.3)"
              value={username}
              onChangeText={setUsername}
              returnKeyType="done"
            />
          </View>

          {/* Avatar picker */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabel}>
              <MaterialIcons name="face" size={14} color="#6b8227" />
              <Text style={styles.fieldLabelText}>Pilih Karaktermu</Text>
            </View>

            <View style={styles.avatarRow}>
              {AVATARS.map((av) => {
                const isSelected = av.id === selectedAvatar;
                return (
                  <Pressable
                    key={av.id}
                    onPress={() => setSelectedAvatar(av.id)}
                    style={[
                      styles.avatarWrap,
                      isSelected ? styles.avatarSelected : styles.avatarUnselected,
                    ]}
                  >
                    <Image
                      source={{ uri: av.uri }}
                      style={[styles.avatarImg, !isSelected && { opacity: 0.8 }]}
                    />
                    {isSelected && (
                      <View style={styles.avatarOverlay}>
                        <View style={styles.checkBadge}>
                          <MaterialIcons name="check" size={16} color="#6b8227" />
                        </View>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* ── Actions ──────────────────────────────────────────────────────── */}
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }]}
            onPress={() => router.replace('/home')}
          >
            <Text style={styles.primaryBtnText}>Mulai!</Text>
            <Text style={styles.rocketEmoji}>🚀</Text>
          </Pressable>

          <View style={styles.loginHintRow}>
            <Text style={styles.loginHint}>Sudah punya akun? </Text>
            <Pressable onPress={() => router.replace('/home')}>
              <Text style={styles.loginLink}>Masuk di sini</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Background gradient overlay (bottom) */}
      <View style={styles.bgGradientBottom} pointerEvents="none" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fbf9f8',
  },
  scroll: {
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 28,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  headerArea: {
    width: '100%',
    alignItems: 'flex-start',
    position: 'relative',
  },
  starBadge: {
    position: 'absolute',
    top: 0,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFE087',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    zIndex: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1B1C1C',
    letterSpacing: -0.5,
    lineHeight: 42,
    marginTop: 56,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#564334',
    lineHeight: 20,
    marginTop: 16,
  },

  // ── Card ────────────────────────────────────────────────────────────────
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    padding: 28,
    gap: 28,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  fieldGroup: {
    gap: 12,
  },
  fieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fieldLabelText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6b8227',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '700',
    color: '#1B1C1C',
  },

  // ── Avatar picker ────────────────────────────────────────────────────────
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  avatarWrap: {
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSelected: {
    width: 68,
    height: 68,
    borderWidth: 3,
    borderColor: '#6b8227',
    // ring effect via shadow
    shadowColor: '#d4ec95',
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  avatarUnselected: {
    width: 56,
    height: 56,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#f0f0f0',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // ── Actions ──────────────────────────────────────────────────────────────
  actions: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
    marginTop: 4,
  },
  primaryBtn: {
    width: '100%',
    height: 64,
    backgroundColor: '#5E4B3B',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#5E4B3B',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  rocketEmoji: {
    fontSize: 20,
  },
  loginHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginHint: {
    fontSize: 13,
    color: 'rgba(27,28,28,0.6)',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '800',
    color: '#3b4d06',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },

  // ── Background decoration ─────────────────────────────────────────────────
  bgGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(244,235,217,0.15)',
    pointerEvents: 'none',
  },
});
