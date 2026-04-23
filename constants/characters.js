// ── Central character data ─────────────────────────────────────────────────
// Add new characters here. KarakterScreen & ChooseKarakterScreen read from this file.

export const CHARACTERS = [
  {
    id: 'asih',
    name: 'Asih',
    desc: 'Sang Sahabat Setia',
    category: 'Karakter Utama',
    rarity: 'Common',
    rarityColor: '#52651E',
    locked: false,
    pts: 0,
    image: require('../assets/images/characters/Asih/Asih1.png'),
    poses: [
      require('../assets/images/characters/Asih/Asih1.png'),
      require('../assets/images/characters/Asih/Asih2.png'),
      require('../assets/images/characters/Asih/Asih3.png'),
      require('../assets/images/characters/Asih/Asih4.png'),
      require('../assets/images/characters/Asih/Asih5.png'),
    ],
  },
  {
    id: 'garuda',
    name: 'Garuda',
    desc: 'Simbol Keberanian',
    category: 'Karakter Udara',
    rarity: 'Rare',
    rarityColor: '#3B6659',
    locked: false,
    pts: 0,
    image: require('../assets/images/characters/Garuda/Garuda1.png'),
    poses: [
      require('../assets/images/characters/Garuda/Garuda1.png'),
      require('../assets/images/characters/Garuda/Garuda2.png'),
      require('../assets/images/characters/Garuda/Garuda3.png'),
      require('../assets/images/characters/Garuda/Garuda4.png'),
      require('../assets/images/characters/Garuda/Garuda5.png'),
    ],
  },
  {
    id: 'komo',
    name: 'Komo',
    desc: 'Petarung Tangguh',
    category: 'Karakter Rimba',
    rarity: 'Epic',
    rarityColor: '#7B4FBF',
    locked: true,
    pts: 1000,
    image: require('../assets/images/characters/Komo/Komo1.png'),
    poses: [
      require('../assets/images/characters/Komo/Komo1.png'),
      require('../assets/images/characters/Komo/Komo2.png'),
      require('../assets/images/characters/Komo/Komo3.png'),
      require('../assets/images/characters/Komo/Komo4.png'),
      require('../assets/images/characters/Komo/Komo5.png'),
    ],
  },
  {
    id: 'mauwi',
    name: 'Mauwi',
    desc: 'Penyihir Cerdik',
    category: 'Karakter Mistis',
    rarity: 'Legendary',
    rarityColor: '#C97D10',
    locked: true,
    pts: 2000,
    image: require('../assets/images/characters/Mauwi/Mauwi1.png'),
    poses: [
      require('../assets/images/characters/Mauwi/Mauwi1.png'),
      require('../assets/images/characters/Mauwi/Mauwi2.png'),
      require('../assets/images/characters/Mauwi/Mauwi3.png'),
      require('../assets/images/characters/Mauwi/Mauwi4.png'),
      require('../assets/images/characters/Mauwi/Mauwi5.png'),
    ],
  },
];

/** Helper — get one character by id */
export const getCharacter = (id) => CHARACTERS.find((c) => c.id === id) ?? null;
