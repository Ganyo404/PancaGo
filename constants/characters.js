// ── Central character data ─────────────────────────────────────────────────
// Add new characters here. KarakterScreen & ChooseKarakterScreen read from this file.

export const CHARACTERS = [
  {
    id: 'dirga',
    name: 'Dirga',
    desc: 'Sang Penjaga',
    category: 'Karakter Hutan',
    rarity: 'Common',
    rarityColor: '#52651E',
    edition: null,
    locked: false,
    pts: 0,
    bonusIcon: 'bolt',
    bonusTitle: 'Bonus XP +5%',
    bonusDesc: 'Dapatkan XP lebih setiap kali menyelesaikan kuis apapun.',
    requirement: 'Tersedia untuk semua petualang.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDbo7LcxIWuFnw-gNiTYSezp2-SOPrwlXCwWklGnRz1ySMrP8EsXU8MKVTcJgCOTkSJnlluDG2OrLc7VkwdimHtf5HlQh-9RWSET6Zgr95c0eKEhdLZnPMoOTbJpke-dgvFEWkoJJWbe67Izf22sa5t5MgVjCF07hZv_Dj0LXHLAUR6FbdIa7XcqV9FWK5ku0mxBGD6EGCehLyxfiChO21Bq2Mdgz3zx7zapWWiXbYevSIcYR6p9pSMtnnqiruc-5CFWFbBFfHwsGs',
  },
  {
    id: 'bimo',
    name: 'Bimo',
    desc: 'Kekuatan Hati',
    category: 'Karakter Padang',
    rarity: 'Common',
    rarityColor: '#52651E',
    edition: null,
    locked: false,
    pts: 0,
    bonusIcon: 'favorite',
    bonusTitle: 'Bonus Semangat +15%',
    bonusDesc: 'Tingkatkan semangat belajar setiap kali jawaban kamu benar.',
    requirement: 'Tersedia untuk semua petualang.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBLEo4cKB9IuM8seYV6vkRtfImNhZIFDS6PXAtfT9-Xcr6j-RYqqaHE18hb4Dcn2Je16qKNCGAyheNQaJ2N_jzshipvL7fDpES4Hu9zfbMvabCo4HQLfzdKMHQ4hg8yJdQsXFoKHVcNz-lwQ1xj3cd19FakNoxt_g1eO3pOYzyYsKC2wf-Qq5_gvCla0hqBXRxjXwnrQiLNeEIVlfDzWph5qwBEIFGn9EFofM73MCmo-gDN65wWfggqLUmc73Ibgj2SoQ6v-p9ObCk',
  },
  {
    id: 'harimau',
    name: 'Harimau Rimba',
    desc: 'Si Pemburu Cepat',
    category: 'Karakter Rimba',
    rarity: 'Rare',
    rarityColor: '#3B6659',
    edition: null,
    locked: true,
    pts: 1000,
    bonusIcon: 'speed',
    bonusTitle: 'Bonus Kecepatan +10%',
    bonusDesc: 'Jawab lebih cepat dan kumpulkan poin berlipat ganda setiap kuis.',
    requirement: 'Diperlukan 1,000 Pts untuk membuka karakter ini.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAjtfpvi-188nwk3R9s-3YU4gz2zhRkJ7t5p1xepybm4y60kGZahRi3ieqcb9ym69lNE2yoJu-Gm9F3iBEULMBfmBJVp0eP9YtywSaSfMNx0d8jVlP2ffIEHNfa5NHhKd3U23LR910Bmt6llHdqAMUzhg_wlmO904KimBlb_BGAFw23Ks4cL39RRl1GtB1_Y7MEoQqpNRLTynkS1UXwfbMrQVJyVgQ9UEEyLahjzwGQECxUE12qMfGjkXhN-CTiEOYfjaIQcxuYMGU',
  },
  {
    id: 'rusa',
    name: 'Rusa Anggun',
    desc: 'Sang Penjelajah',
    category: 'Karakter Padang',
    rarity: 'Epic',
    rarityColor: '#7B4FBF',
    edition: null,
    locked: true,
    pts: 1500,
    bonusIcon: 'explore',
    bonusTitle: 'Bonus Eksplorasi +20%',
    bonusDesc: 'Buka lokasi baru lebih cepat dalam Peta Nusantara.',
    requirement: 'Diperlukan 1,500 Pts untuk membuka karakter ini.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCi6Nvlg9ceweGZKx1lBSdW0VM8ZBE682p2jogQgsozslBqSU7QY0xftQneaqPi_-_WesOlu700q8GBc6ho8_VEE5TAvFETV8aoa9zfd4puJXKctJfODXoiQSBxLsHXx4legoN0MsThYlCi8OJX2mk-F9U29MIjWot2xhAzyF86IW6yLt0fJpxCNWfCMXlDxPv3EIBARku0Ye_fXxxoJiV88bsiaX8w9d73OdghPUqDzg8sT9fPRrpWVUKFZ-ZD96OEY1HuutJzMmk',
  },
  {
    id: 'naga',
    name: 'Naga Nusantara',
    desc: 'Penjaga Legendaris',
    category: 'Karakter Langka',
    rarity: 'Legendary',
    rarityColor: '#C97D10',
    edition: 'EDISI TERBATAS',
    locked: true,
    pts: 2500,
    bonusIcon: 'auto-awesome',
    bonusTitle: 'Bonus Poin +25%',
    bonusDesc: 'Kumpulkan poin berlipat ganda di semua aktivitas belajar.',
    requirement: 'Diperlukan 2,500 Pts. Edisi sangat terbatas!',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCCJERqnMIch39q3VA_ju5udoXlzr-Lc20iMl9UFt3uPsZAwyat0J8F_R3hsBsFXggIM7FTM04qB-7xW-TlNI--vEqmCgSa5sg8XRlMUmaqqWhtUSISq8_CBTl1wn1GaJNogMTl2b0d0pmiSv53ecVt0K8fDwzydAPMzSI6UEMVDhYx4nkE-zFB8vxOPVIjy09VDNJCDKhxXiQAW-_0VYvtAzjrn2i8s1_YRar1vVzq13BCQbSZ0LOj9NGA2Q3XhSuf4iUtpH9BbWTg',
  },
];

/** Helper — get one character by id */
export const getCharacter = (id) => CHARACTERS.find((c) => c.id === id) ?? null;
