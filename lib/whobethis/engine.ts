import { ALL_DECKS } from './decks';

// ---------- Cards ----------

export function shuffle<T>(arr: T[], rnd: () => number = Math.random): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

// Shuffles the deck, leaving out cards already used tonight. When fewer than 20 fresh cards
// remain, the deck starts over so the game never runs dry.
export function pickQueue(words: string[], used: string[], rnd: () => number = Math.random) {
  const usedSet = new Set(used.map((s) => s.toLowerCase()));
  let pool = words.filter((w) => !usedSet.has(w.toLowerCase()));
  let nextUsed = used;
  if (pool.length < 20) {
    const deckSet = new Set(words.map((w) => w.toLowerCase()));
    pool = words.slice();
    nextUsed = used.filter((u) => !deckSet.has(u.toLowerCase()));
  }
  return { queue: shuffle(pool, rnd), used: nextUsed };
}

// ---------- Tilt ----------

export type TiltDir = 'down' | 'up';

// +1 when the screen faces the ceiling, -1 when it faces the floor, 0 when it faces straight ahead.
// Works the same in portrait and landscape, and the same on iPhone and Android.
export function tiltFactor(beta: number, gamma: number): number {
  const r = Math.PI / 180;
  return Math.cos(beta * r) * Math.cos(gamma * r);
}

// ---------- Round state ----------

export type Phase = 'home' | 'countdown' | 'playing' | 'results';
export type Answer = { word: string; ok: boolean };
export type Feedback = 'ok' | 'pass' | null;

export type Play = {
  phase: Phase;
  queue: string[];
  idx: number;
  answers: Answer[];
  count: number;
  endAt: number;
  secsLeft: number;
  feedback: Feedback;
};

export const initialPlay: Play = {
  phase: 'home',
  queue: [],
  idx: 0,
  answers: [],
  count: 3,
  endAt: 0,
  secsLeft: 0,
  feedback: null,
};

export type Action =
  | { type: 'start'; queue: string[] }
  | { type: 'count' }
  | { type: 'begin'; endAt: number; secs: number }
  | { type: 'tick'; now: number }
  | { type: 'answer'; ok: boolean }
  | { type: 'next' }
  | { type: 'home' };

export function reducer(state: Play, a: Action): Play {
  switch (a.type) {
    case 'start':
      return { ...initialPlay, phase: 'countdown', queue: a.queue, count: 3 };
    case 'count':
      return state.phase === 'countdown' ? { ...state, count: Math.max(0, state.count - 1) } : state;
    case 'begin':
      return state.phase === 'countdown'
        ? { ...state, phase: 'playing', endAt: a.endAt, secsLeft: a.secs, feedback: null }
        : state;
    case 'tick': {
      if (state.phase !== 'playing') return state;
      const ms = state.endAt - a.now;
      if (ms <= 0) return { ...state, phase: 'results', secsLeft: 0, feedback: null };
      const left = Math.ceil(ms / 1000);
      return left === state.secsLeft ? state : { ...state, secsLeft: left };
    }
    case 'answer': {
      if (state.phase !== 'playing' || state.feedback) return state;
      const word = state.queue[state.idx];
      if (word === undefined) return state;
      return { ...state, answers: [...state.answers, { word, ok: a.ok }], feedback: a.ok ? 'ok' : 'pass' };
    }
    case 'next': {
      if (state.phase !== 'playing' || !state.feedback) return state;
      const idx = state.idx + 1;
      if (idx >= state.queue.length) return { ...state, idx, feedback: null, phase: 'results' };
      return { ...state, idx, feedback: null };
    }
    case 'home':
      return initialPlay;
    default:
      return state;
  }
}

export const scoreOf = (answers: Answer[]): number => answers.filter((x) => x.ok).length;

// ---------- Saved settings and scores ----------

export type Round = { name: string; deckId: string; score: number; at: number };
export type Seconds = 60 | 90 | 120;
export type Prefs = {
  deckId: string;
  seconds: Seconds;
  tilt: boolean;
  sound: boolean;
  name: string;
  rounds: Round[];
  used: string[];
};

export function defaultPrefs(touch: boolean): Prefs {
  return { deckId: 'world', seconds: 90, tilt: touch, sound: true, name: '', rounds: [], used: [] };
}

function isRound(r: unknown): r is Round {
  if (!r || typeof r !== 'object') return false;
  const x = r as Partial<Round>;
  return (
    typeof x.name === 'string' &&
    typeof x.deckId === 'string' &&
    typeof x.score === 'number' &&
    typeof x.at === 'number'
  );
}

// Turns whatever was saved in the browser into safe settings.
export function sanitizePrefs(src: unknown, touch: boolean): Prefs {
  const base = defaultPrefs(touch);
  if (!src || typeof src !== 'object') return base;
  const s = src as Partial<Record<keyof Prefs, unknown>>;
  const deckId = typeof s.deckId === 'string' && ALL_DECKS.some((d) => d.id === s.deckId) ? s.deckId : base.deckId;
  const seconds: Seconds = s.seconds === 60 || s.seconds === 120 ? s.seconds : 90;
  return {
    deckId,
    seconds,
    tilt: typeof s.tilt === 'boolean' ? s.tilt : base.tilt,
    sound: typeof s.sound === 'boolean' ? s.sound : base.sound,
    name: typeof s.name === 'string' ? s.name.slice(0, 24) : '',
    rounds: Array.isArray(s.rounds) ? (s.rounds as unknown[]).filter(isRound).slice(-60) : [],
    used: Array.isArray(s.used) ? (s.used as unknown[]).filter((u): u is string => typeof u === 'string').slice(-400) : [],
  };
}
