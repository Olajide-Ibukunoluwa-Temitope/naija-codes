import type { FormEvent } from 'react';
import { ALL_DECKS } from '../../lib/whobethis/decks';
import type { Prefs, Seconds } from '../../lib/whobethis/engine';

type Props = {
  prefs: Prefs;
  tiltNote: string;
  onDeck: (id: string) => void;
  onSeconds: (s: Seconds) => void;
  onTilt: () => void;
  onSound: (on: boolean) => void;
  onName: (name: string) => void;
  onStart: () => void;
};

const LENGTHS: [Seconds, string][] = [
  [60, '60 s'],
  [90, '90 s'],
  [120, '2 min'],
];

export default function Home({ prefs, tiltNote, onDeck, onSeconds, onTilt, onSound, onName, onStart }: Props) {
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onStart();
  };

  return (
    <>
      <section className="wbt-section" aria-label="Pick a deck">
        <h2 className="wbt-h">Pick a deck</h2>
        <div className="wbt-decks">
          {ALL_DECKS.map((d) => {
            const on = prefs.deckId === d.id;
            return (
              <button
                key={d.id}
                type="button"
                className="wbt-deck"
                aria-pressed={on}
                onClick={() => onDeck(d.id)}
                style={{ '--deck-bg': d.bg, '--deck-fg': d.fg } as React.CSSProperties}
              >
                <span className="top">
                  <span className="n">{d.name}</span>
                  {on ? <span className="sel">Selected</span> : null}
                </span>
                <span className="c">{d.blurb}</span>
                <span className="c">{d.words.length} cards</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="wbt-section wbt-settings" aria-label="Settings">
        <div className="wbt-field">
          <span className="wbt-lbl" id="wbt-len">Round length</span>
          <div className="seg" role="group" aria-labelledby="wbt-len">
            {LENGTHS.map(([s, label]) => (
              <button key={s} type="button" aria-pressed={prefs.seconds === s} onClick={() => onSeconds(s)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="wbt-field">
          <span className="wbt-lbl" id="wbt-tilt">Tilt to answer</span>
          <div className="seg" role="group" aria-labelledby="wbt-tilt">
            <button type="button" aria-pressed={prefs.tilt} onClick={() => (prefs.tilt ? undefined : onTilt())}>On</button>
            <button type="button" aria-pressed={!prefs.tilt} onClick={() => (prefs.tilt ? onTilt() : undefined)}>Off</button>
          </div>
        </div>
        <div className="wbt-field">
          <span className="wbt-lbl" id="wbt-sound">Sound</span>
          <div className="seg" role="group" aria-labelledby="wbt-sound">
            <button type="button" aria-pressed={prefs.sound} onClick={() => onSound(true)}>On</button>
            <button type="button" aria-pressed={!prefs.sound} onClick={() => onSound(false)}>Off</button>
          </div>
        </div>
        <p className="wbt-tiltnote" role="status">
          {tiltNote || 'Tilt works on phones. On an iPhone it asks for permission the first time.'}
        </p>
      </section>

      <form className="wbt-section wbt-start" onSubmit={submit}>
        <div className="wbt-field grow">
          <label className="wbt-lbl" htmlFor="wbt-name">Who is up?</label>
          <input
            id="wbt-name"
            className="wbt-input"
            value={prefs.name}
            maxLength={24}
            autoComplete="off"
            placeholder="Name (optional)"
            onChange={(e) => onName(e.target.value)}
          />
        </div>
        <button type="submit" className="btn solid wbt-go">Start round</button>
      </form>

      <section className="wbt-section wbt-how" aria-label="How to play">
        <h2 className="wbt-h">How to play</h2>
        <ol>
          <li>Pick a deck and press Start round. Hold the phone to your forehead with the screen facing your friends.</li>
          <li>Your friends give clues without saying the word. Tilt the phone down when you get it. Tilt up to pass.</li>
          <li>
            Playing on a laptop or TV? Face away from the screen. A friend presses the right arrow for Got it and the
            left arrow for Pass.
          </li>
          <li>When time runs out you see your score. Pass the phone to the next person.</li>
        </ol>
      </section>
    </>
  );
}
