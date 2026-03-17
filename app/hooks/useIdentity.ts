import { useState, useEffect } from 'react';

const IDENTITY_URL = 'https://www.spangascouterna.se/backstage/apps/mobile/identity/';

export interface Identity {
  userId: string;
  username: string;
}

export function useIdentity() {
  const [identity, setIdentity] = useState<Identity | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchIdentity() {
      try {
        const res = await fetch(IDENTITY_URL, { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setIdentity(data);
      } catch {
        // Inte inloggad eller nätverksfel – inga badges
      }
    }

    fetchIdentity();
    return () => { cancelled = true; };
  }, []);

  return identity;
}
