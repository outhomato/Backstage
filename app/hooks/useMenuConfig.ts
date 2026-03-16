import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

export type TabConfig = {
  label: string;
  icon: string;
  url: string;
  initial: boolean;
};

export type MenuConfig = {
  tabs: TabConfig[];
};

const platform = Platform.OS === 'android' ? 'android' : 'ios';
export const MENU_BASE_URL = `https://www.spangascouterna.se/backstage/apps/mobile/${platform}/`;

export function useMenuConfig() {
  const [config, setConfig] = useState<MenuConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${MENU_BASE_URL}menu.json`)
      .then(r => r.json())
      .then((data: MenuConfig) => {
        setConfig(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { config, loading, error };
}
