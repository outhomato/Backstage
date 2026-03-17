import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IDENTITY_URL   = 'https://www.spangascouterna.se/backstage/apps/mobile/identity/';
const STORAGE_KEY    = 'identity';
const POLL_INTERVAL  = 10_000; // 10 sekunder tills identity är satt

export interface Identity {
  userId: string;
  username: string;
}

export function useIdentity() {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Läs sparad identity direkt från disk
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) setIdentity(JSON.parse(raw));
    });

    async function fetchIdentity() {
      try {
        const res = await fetch(IDENTITY_URL, { credentials: 'include' });
        if (!res.ok) return;
        const data: Identity = await res.json();
        setIdentity(data);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        // Identity hämtad – sluta polla
        if (timerRef.current) clearInterval(timerRef.current);
      } catch {
        // Inte inloggad än – försök igen om 10 sek
      }
    }

    fetchIdentity();
    timerRef.current = setInterval(fetchIdentity, POLL_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Stoppa polling när identity väl är satt
  useEffect(() => {
    if (identity && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [identity]);

  return identity;
}
