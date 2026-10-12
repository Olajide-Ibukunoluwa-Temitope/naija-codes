import { PACKS, type PackKey } from './words';

export type TeamId = 'g' | 'y';
export type Kind = TeamId | 'n' | 'x';
export type Mode = 'board' | 'spy';
// A tap on a card reveals it. "e" means the team ended its turn.
export type LogEntry = { t: 'r'; i: number } | { t: 'e' };
export type Board = { words: string[]; key: Kind[]; first: TeamId };
export type GameState = {
  turn: TeamId;
  revealed: Set<number>;
  left: Record<TeamId, number>;
  winner: TeamId | null;
  assassinBy: TeamId | null;
  over: boolean;
};
export type Saved = { code: string; log: LogEntry[]; mode: Mode };

export const TEAM_NAME: Record<TeamId, string> = { g: 'Green', y: 'Danfo' };
export const KIND_NAME: Record<Kind, string> = { g: 'Green team', y: 'Danfo team', n: 'Neutral', x: 'Assassin' };

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const other = (t: TeamId): TeamId => (t === 'g' ? 'y' : 'g');

export function cleanCode(s: unknown): string {
  return String(s == null ? '' : s).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
}

// The first letter of a game code picks the word pack, so phones follow the host automatically.
export function packOf(code: string): PackKey {
  const p = String(code || '').charAt(0).toUpperCase();
  return p === 'N' || p === 'M' || p === 'C' ? p : 'N';
}

export function randomCode(pack: PackKey): string {
  let s: string = pack;
  for (let i = 0; i < 4; i++) s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return s;
}

export function seedFrom(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

// Same code in, same board out. That is how phones and the big screen agree.
export function makeBoard(code: string): Board {
  const rnd = mulberry32(seedFrom(code));
  const words = shuffle(PACKS[packOf(code)].words, rnd).slice(0, 25);
  const first: TeamId = rnd() < 0.5 ? 'g' : 'y';
  const second = other(first);
  const keys: Kind[] = [
    ...Array<Kind>(9).fill(first),
    ...Array<Kind>(8).fill(second),
    ...Array<Kind>(7).fill('n'),
    'x',
  ];
  return { words, key: shuffle(keys, rnd), first };
}

export function derive(board: Board, log: LogEntry[]): GameState {
  let turn = board.first;
  const revealed = new Set<number>();
  let assassinBy: TeamId | null = null;
  for (const e of log) {
    if (assassinBy) break;
    if (e.t === 'e') {
      turn = other(turn);
      continue;
    }
    if (revealed.has(e.i)) continue;
    revealed.add(e.i);
    const k = board.key[e.i];
    if (k === 'x') assassinBy = turn;
    else if (k !== turn) turn = other(turn);
  }
  const left: Record<TeamId, number> = { g: 0, y: 0 };
  board.key.forEach((k, i) => {
    if ((k === 'g' || k === 'y') && !revealed.has(i)) left[k] += 1;
  });
  let winner: TeamId | null = null;
  if (assassinBy) winner = other(assassinBy);
  else if (left.g === 0) winner = 'g';
  else if (left.y === 0) winner = 'y';
  return { turn, revealed, left, winner, assassinBy, over: winner !== null };
}

function isEntry(e: unknown): e is LogEntry {
  if (!e || typeof e !== 'object') return false;
  const x = e as { t?: unknown; i?: unknown };
  if (x.t === 'e') return true;
  return x.t === 'r' && typeof x.i === 'number' && Number.isInteger(x.i) && x.i >= 0 && x.i < 25;
}

// Turns whatever was saved in the browser into a safe starting state.
export function sanitize(src: unknown): Saved {
  const s = (src && typeof src === 'object' ? src : {}) as { code?: unknown; log?: unknown; mode?: unknown };
  const code = cleanCode(s.code);
  if (code.length < 3) return { code: randomCode('N'), log: [], mode: 'board' };
  const log = Array.isArray(s.log) ? (s.log as unknown[]).filter(isEntry) : [];
  return { code, log, mode: s.mode === 'spy' ? 'spy' : 'board' };
}
