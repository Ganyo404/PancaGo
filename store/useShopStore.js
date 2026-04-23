// store/useShopStore.js
// (Wrapper tipis — logika beli karakter sudah ada di useUserStore)
// File ini bisa dipakai untuk logika toko yang lebih kompleks di masa depan

import { useUserStore } from './useUserStore';

// Re-export helper untuk dipakai di komponen jika perlu
export function useShopStore() {
  const { points, ownedCharIds, equippedCharId, buyCharacter } = useUserStore();

  const canAfford = (cost) => points >= cost;
  const isOwned = (charId) => ownedCharIds.includes(charId);
  const isEquipped = (charId) => equippedCharId === charId;

  return {
    points,
    ownedCharIds,
    equippedCharId,
    buyCharacter,
    canAfford,
    isOwned,
    isEquipped,
  };
}
