import { useState, useEffect, useRef } from 'react';

const BADGES_URL = 'https://www.spangascouterna.se/backstage/mobile/badges/';
const POLL_INTERVAL_MS = 60_000;

export interface BadgeConfig {
  count?: number;  // utelämnas = prick, 0 = ingen badge
  color?: string;  // standard: '#FF3B30'
}

export type BadgeMap = Record<string, BadgeConfig>;

export function useBadges() {
  const [badges, setBadges] = useState<BadgeMap>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function fetchBadges() {
      try {
        const res = await fetch(BADGES_URL, {
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
