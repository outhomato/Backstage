import { useState, useEffect, useRef } from 'react';

const BADGES_BASE_URL = 'https://www.spangascouterna.se/backstage/mobile/badges/';
const POLL_INTERVAL_MS = 60_000;

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
        const res = await fetch(`${BADGES_BASE_URL}${userId}.json`, {
          credentials: 'include',
          cache: 'no-store',
        });
        if (!res.ok) { setBadges({}); return; }
        const data = await res.json();
        setBadges(data.badges ?? {});
      } catch {
        setBadges({});
      }
    }

    fetchBadges();
    timerRef.current = setInterval(fetchBadges, POLL_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [userId]);

  return badges;
}
