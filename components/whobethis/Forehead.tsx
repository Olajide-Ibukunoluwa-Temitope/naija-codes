'use client';

import { useState, type FormEvent } from 'react';
import FitText from './FitText';
import { DECKS, MIX, type Deck } from '../../lib/whobethis/decks';
import { shuffle } from '../../lib/whobethis/engine';
import { cleanCode, mulberry32, seedFrom } from '../../lib/game';

// Everyone plays at once, each with a different famous name on their forehead.
// No server: the game code, round and seat number decide which name a phone shows,
// so every phone in the room gets a different one.

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const MAX_SEATS = 12;

// The first letter of the code picks the deck, so phones follow whoever made the code.
const PEOPLE: Record<string, Deck> = {
  W: DECKS.find((d) => d.id === 'world') ?? MIX,
  N: DECKS.find((d) => d.id === 'stars') ?? MIX,
  M: {
    ...MIX,
    id: 'people-mix',
    name: 'World and Naija Stars',
    words: [...(DECKS.find((d) => d.id === 'world')?.words ?? []), ...(DECKS.find((d) => d.id === 'stars')?.words ?? [])],
  },
};
const DECK_CHOICES: { key: string; label: string }[] = [
  { key: 'W', label: 'World Stars' },
  { key: 'N', label: 'Naija Stars' },
  { key: 'M', label: 'Both' },
];

function randomCode(deckKey: string): string {
  let s = deckKey;
  for (let i = 0; i < 4; i++) s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return s;
}

function nameFor(code: string, round: number, seat: number): string {
  const deck = PEOPLE[code.charAt(0)] ?? PEOPLE.W;
  const order = shuffle(deck.words, mulberry32(seedFrom(`${code}:${round}`)));
  return order[(seat - 1) % order.length];
}

type Stage = 'setup' | 'ready' | 'show' | 'done';

export default function Forehead() {
  const [code, setCode] = useState('');
  const [seat, setSeat] = useState(1);
  const [round, setRound] = useState(1);
  const [stage, setStage] = useState<Stage>('setup');

  const name = code.length >= 2 ? nameFor(code, round, seat) : '';
  const deck = PEOPLE[code.charAt(0)] ?? PEOPLE.W;

  const join = (e: FormEvent) => {
    e.preventDefault();
    if (code.length >= 2) setStage('ready');
  };

  if (stage === 'ready' || stage === 'show' || stage === 'done') {
    return (
      <div className="wbt-play wbt-fh" style={{ '--deck-bg': '#1D4ED8', '--deck-fg': '#FFFFFF' } as React.CSSProperties}>
        <div className="wbt-top">
          <span className="wbt-chip">Player {seat} · Round {round}</span>
          <button type="button" className="wbt-quit" onClick={() => setStage('setup')}>Leave</button>
        </div>
        {stage === 'ready' ? (
          <div className="wbt-fh-mid">
            <p className="wbt-fh-big">Don&apos;t look!</p>
            <p className="wbt-count-tip">
              Your name is hidden. Press the button, then hold the phone to your forehead with the screen facing your friends.
            </p>
            <button type="button" className="wbt-act ok wbt-fh-btn" onClick={() => setStage('show')}>Show my name</button>
          </div>
        ) : (
          <>
            <div className="wbt-word"><FitText text={name} /></div>
            <p className="wbt-note">
              {stage === 'done'
                ? 'You got it! Wait for the others to finish.'
                : 'Take turns asking yes or no questions. Friends tap the button when you guess it.'}
            </p>
            <div className="wbt-actions">
              {stage === 'done' ? (
                <button type="button" className="wbt-act ok" onClick={() => { setRound(round + 1); setStage('ready'); }}>
                  Next round
                </button>
              ) : (
                <button type="button" className="wbt-act ok" onClick={() => setStage('done')}>They got it</button>
              )}
              <button type="button" className="wbt-act" onClick={() => setStage('ready')}>Hide</button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <header className="bar">
        <div className="wrap bar-in">
          <div className="brand">
            <h1>Who Am I</h1>
            <p>Everyone plays at once. A different famous name on every forehead.</p>
            <p className="switch"><a className="btn" href="/who-be-this">Back to Who Be This</a></p>
          </div>
        </div>
      </header>
      <main className="wrap main">
        <form className="wbt-section wbt-fh-form" onSubmit={join}>
          <div className="wbt-field">
            <span className="wbt-lbl" id="fh-deck">Names from</span>
            <div className="seg" role="group" aria-labelledby="fh-deck">
              {DECK_CHOICES.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  aria-pressed={code.charAt(0) === c.key}
                  onClick={() => setCode(randomCode(c.key))}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="wbt-field">
            <label className="wbt-lbl" htmlFor="fh-code">Game code</label>
            <input
              id="fh-code"
              className="wbt-input"
              value={code}
              maxLength={8}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="Pick names above, or type the code"
              onChange={(e) => setCode(cleanCode(e.target.value))}
            />
            <p className="hint">One person picks the names and shares the code. Everyone else types the same code.</p>
          </div>
          <div className="wbt-field">
            <span className="wbt-lbl" id="fh-seat">Your player number</span>
            <div className="seg" role="group" aria-labelledby="fh-seat">
              {Array.from({ length: MAX_SEATS }, (_, i) => i + 1).map((n) => (
                <button key={n} type="button" aria-pressed={seat === n} onClick={() => setSeat(n)}>{n}</button>
              ))}
            </div>
            <p className="hint">Everyone needs a different number, such as 1, 2, 3 and so on.</p>
          </div>
          <button type="submit" className="btn solid wbt-go" disabled={code.length < 2}>Join game</button>
        </form>

        <section className="wbt-section wbt-how" aria-label="How to play">
          <h2 className="wbt-h">How to play</h2>
          <ol>
            <li>Everyone opens this page on their own phone and enters the same code, each with a different player number.</li>
            <li>Press Show my name and hold your phone to your forehead. You can&apos;t see it, but everyone else can.</li>
            <li>Go round the group. On your turn, ask one yes or no question about who you are.</li>
            <li>Keep going until you guess your name. There is no timer. When you do, a friend taps They got it.</li>
          </ol>
          <p className="hint">{deck.name} has {deck.words.length} names, enough for {Math.min(MAX_SEATS, deck.words.length)} players.</p>
        </section>
      </main>
    </div>
  );
}
