import type { Saved } from './game';

const STORE_KEY = 'naija-codes-v2';

// Saved on each device, so a refresh does not lose the game. Storage can be blocked, so every call is guarded.
export function loadSaved(): unknown {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveState(v: Saved): void {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(v));
  } catch {
    /* storage can be blocked */
  }
}
