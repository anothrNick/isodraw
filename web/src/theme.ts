import { useEffect, useState, useSyncExternalStore } from 'react';

/** The theme setting: a choice, or follow the system. Kept in this browser. */
export type ThemeSetting = 'light' | 'dark' | 'system';

const KEY = 'isodraw:theme';
const media = () => window.matchMedia('(prefers-color-scheme: dark)');

function read(): ThemeSetting {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
}

const listeners = new Set<() => void>();
let current = read();

export function setThemeSetting(t: ThemeSetting) {
  current = t;
  try {
    if (t === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, t);
  } catch {
    /* storage unavailable */
  }
  for (const l of listeners) l();
}

/** The setting, and the light or dark theme it comes to right now. Keeps <html class="dark"> in step. */
export function useTheme(): { setting: ThemeSetting; resolved: 'light' | 'dark' } {
  const setting = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
  );
  const [systemDark, setSystemDark] = useState(() => media().matches);
  useEffect(() => {
    const m = media();
    const on = () => setSystemDark(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  const resolved = setting === 'system' ? (systemDark ? 'dark' : 'light') : setting;
  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    document.documentElement.style.colorScheme = resolved;
  }, [resolved]);
  return { setting, resolved };
}
