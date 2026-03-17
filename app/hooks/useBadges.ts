import { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const BADGES_URL     = 'https://www.spangascouterna.se/backstage/apps/mobile/badges/';
const POLL_INTERVAL  = 60_000; // 60 sekunder bakgrundspolling

export interface BadgeConfig {
  count?: number;  // utelämnas = prick, 0 = ingen badge
  color?: string;  // standard: '#FF3B30'
}

export type BadgeMap = Record<string, BadgeConfig>;

export function useBadges(userId: string | null) {
  const [badges, setBadges] = useState<BadgeMap>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!userId) {
      setBadges({});
      return;
    }

    async function fetchBadges() {
      try {
        const res = await fetch(
          `${BADGES_URL}?userId=${encodeURIComponent(userId!)}`,
          { credentials: 'include', cache: 'no-store' }
        );
        if (!res.ok) return;
        const data = await res.json();
        setBadges(data.badges ?? {});
      } catch {
        // Nätverksfel – behåll nuvarande badges
      }
    }

    // Hämta direkt
    fetchBadges();

    // Polla var 60:e sekund
    timerRef.current = setInterval(fetchBadges, POLL_INTERVAL);

    // Hämta direkt när appen blir aktiv (användaren öppnar appen)
    const subscription = AppState.addEventListener(
      'change',
      (state: AppStateStatus) => {
        if (state === 'active') fetchBadges();
      }
    );

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      subscription.remove();
    };
  }, [userId]);

  return badges;
}
