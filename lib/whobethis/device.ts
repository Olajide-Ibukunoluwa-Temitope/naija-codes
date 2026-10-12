import { useEffect, useRef, useState } from 'react';
import { tiltFactor, type TiltDir } from './engine';

// ---------- Saved settings ----------

const STORE_KEY = 'who-be-this-v1';

export function loadPrefs(): unknown {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function savePrefs(v: unknown): void {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(v));
  } catch {
    /* storage can be blocked */
  }
}

export function isTouchDevice(): boolean {
  try {
    return navigator.maxTouchPoints > 0;
  } catch {
    return false;
  }
}

// ---------- Sound ----------

let audio: AudioContext | null = null;

function ctx(): AudioContext | null {
  try {
    if (!audio) {
      const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
      const C = w.AudioContext || w.webkitAudioContext;
      if (!C) return null;
      audio = new C();
    }
    if (audio.state === 'suspended') void audio.resume();
    return audio;
  } catch {
    return null;
  }
}

// Browsers only allow sound after a tap, so this is called from the Start button.
export function unlockAudio(): void {
  ctx();
}

function beep(freq: number, ms: number, type: OscillatorType = 'sine', vol = 0.18, delay = 0): void {
  const c = ctx();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + ms / 1000);
  o.connect(g);
  g.connect(c.destination);
  o.start(t0);
  o.stop(t0 + ms / 1000 + 0.02);
}

export const sfx = {
  correct: () => {
    beep(784, 110, 'sine', 0.2);
    beep(1175, 180, 'sine', 0.2, 0.1);
  },
  pass: () => beep(260, 220, 'triangle', 0.22),
  tick: () => beep(660, 70, 'square', 0.08),
  go: () => beep(988, 260, 'sine', 0.2),
  end: () => {
    beep(330, 250, 'sawtooth', 0.14);
    beep(220, 500, 'sawtooth', 0.14, 0.25);
  },
};

export function buzz(ms = 40): void {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* not every device can vibrate */
  }
}

// ---------- Tilt ----------

export type TiltPerm = 'granted' | 'denied' | 'unsupported';

// iPhones ask for permission, and only when this is called from a tap. Android just says yes.
export async function enableTilt(): Promise<TiltPerm> {
  if (typeof window === 'undefined') return 'unsupported';
  const DOE = (
    window as unknown as {
      DeviceOrientationEvent?: { requestPermission?: () => Promise<'granted' | 'denied'> };
    }
  ).DeviceOrientationEvent;
  if (!DOE) return 'unsupported';
  if (typeof DOE.requestPermission === 'function') {
    try {
      return (await DOE.requestPermission()) === 'granted' ? 'granted' : 'denied';
    } catch {
      return 'denied';
    }
  }
  return 'granted';
}

export type Sensor = 'wait' | 'ok' | 'none';

// Calls onTilt('down') when the screen tips toward the floor and onTilt('up') when it tips toward the ceiling.
// After each tilt the phone has to come back to the forehead position before the next one counts.
export function useTilt(active: boolean, onTilt: (d: TiltDir) => void): Sensor {
  const [sensor, setSensor] = useState<Sensor>('wait');
  const cb = useRef(onTilt);
  useEffect(() => {
    cb.current = onTilt;
  });

  useEffect(() => {
    if (!active) return undefined;
    setSensor('wait');
    let armed = false;
    let neutralSince = 0;
    let lastFire = 0;
    let gotEvent = false;

    const handler = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      if (!gotEvent) {
        gotEvent = true;
        setSensor('ok');
      }
      const f = tiltFactor(e.beta, e.gamma);
      const now = performance.now();
      if (Math.abs(f) < 0.3) {
        if (!neutralSince) neutralSince = now;
        if (now - neutralSince > 300) armed = true;
      } else {
        neutralSince = 0;
      }
      if (armed && now - lastFire > 900) {
        if (f < -0.62) {
          armed = false;
          lastFire = now;
          cb.current('down');
        } else if (f > 0.62) {
          armed = false;
          lastFire = now;
          cb.current('up');
        }
      }
    };

    window.addEventListener('deviceorientation', handler);
    const t = setTimeout(() => {
      if (!gotEvent) setSensor('none');
    }, 2000);
    return () => {
      window.removeEventListener('deviceorientation', handler);
      clearTimeout(t);
    };
  }, [active]);

  return sensor;
}

// ---------- Keep the screen awake ----------

export function useWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active) return undefined;
    let lock: WakeLockSentinel | null = null;
    let cancelled = false;
    (async () => {
      try {
        const l = await navigator.wakeLock?.request('screen');
        if (cancelled) void l?.release();
        else lock = l ?? null;
      } catch {
        /* not supported, or the browser said no */
      }
    })();
    return () => {
      cancelled = true;
      void lock?.release().catch(() => undefined);
    };
  }, [active]);
}
