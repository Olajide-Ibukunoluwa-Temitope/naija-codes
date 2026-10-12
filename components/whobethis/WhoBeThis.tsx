'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import Countdown from './Countdown';
import Home from './Home';
import Leaderboard from './Leaderboard';
import PlayScreen from './PlayScreen';
import Results from './Results';
import { deckById } from '../../lib/whobethis/decks';
import {
  initialPlay,
  pickQueue,
  reducer,
  sanitizePrefs,
  scoreOf,
  type Phase,
  type Prefs,
  type Seconds,
} from '../../lib/whobethis/engine';
import {
  enableTilt,
  isTouchDevice,
  loadPrefs,
  savePrefs,
  sfx,
  unlockAudio,
  useWakeLock,
} from '../../lib/whobethis/device';

export default function WhoBeThis() {
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [play, dispatch] = useReducer(reducer, initialPlay);
  const [tiltNote, setTiltNote] = useState('');
  const [roundName, setRoundName] = useState('');
  const prevPhase = useRef<Phase>('home');

  // Settings live in the browser, so they can only be read after the page loads.
  useEffect(() => {
    setPrefs(sanitizePrefs(loadPrefs(), isTouchDevice()));
  }, []);

  useEffect(() => {
    if (prefs) savePrefs(prefs);
  }, [prefs]);

  const update = (patch: Partial<Prefs>) => setPrefs((p) => (p ? { ...p, ...patch } : p));

  const sound = prefs?.sound ?? true;
  const seconds = prefs?.seconds ?? 90;

  // 3, 2, 1, then the round starts.
  useEffect(() => {
    if (play.phase !== 'countdown') return undefined;
    if (play.count === 0) {
      dispatch({ type: 'begin', endAt: Date.now() + seconds * 1000, secs: seconds });
      if (sound) sfx.go();
      return undefined;
    }
    if (sound) sfx.tick();
    const id = setTimeout(() => dispatch({ type: 'count' }), 1000);
    return () => clearTimeout(id);
  }, [play.phase, play.count]);

  // When a round ends, save the score and remember which cards were shown.
  useEffect(() => {
    if (prevPhase.current === 'playing' && play.phase === 'results' && prefs) {
      const seen = play.queue.slice(0, play.idx + 1);
      const round = { name: roundName, deckId: prefs.deckId, score: scoreOf(play.answers), at: Date.now() };
      setPrefs({
        ...prefs,
        used: prefs.used.concat(seen).slice(-400),
        rounds: prefs.rounds.concat([round]).slice(-60),
      });
      if (prefs.sound) sfx.end();
    }
    prevPhase.current = play.phase;
  }, [play.phase]);

  useWakeLock(play.phase === 'countdown' || play.phase === 'playing');

  if (!prefs) return <p className="boot">Loading...</p>;

  const deck = deckById(prefs.deckId);

  const startRound = async () => {
    unlockAudio();
    let tilt = prefs.tilt;
    if (tilt) {
      const r = await enableTilt();
      if (r !== 'granted') {
        tilt = false;
        update({ tilt: false });
        setTiltNote(
          r === 'denied'
            ? 'Tilt was blocked, so this round uses the buttons. You can allow motion for this site in your browser settings.'
            : 'This device has no tilt sensor, so this round uses the buttons and arrow keys.',
        );
      }
    }
    const name = prefs.name.trim() || `Player ${prefs.rounds.length + 1}`;
    setRoundName(name);
    const { queue, used } = pickQueue(deck.words, prefs.used);
    update({ used });
    dispatch({ type: 'start', queue });
  };

  const toggleTilt = async () => {
    if (prefs.tilt) {
      update({ tilt: false });
      setTiltNote('');
      return;
    }
    const r = await enableTilt();
    if (r === 'granted') {
      update({ tilt: true });
      setTiltNote('Tilt is on. Tilt down for Got it and up for Pass.');
    } else {
      update({ tilt: false });
      setTiltNote(
        r === 'denied'
          ? 'Tilt was blocked. Allow motion for this site in your browser settings, or use the buttons.'
          : 'This device has no tilt sensor. Use the buttons or the arrow keys.',
      );
    }
  };

  if (play.phase === 'countdown') return <Countdown count={play.count} deck={deck} tilt={prefs.tilt} />;
  if (play.phase === 'playing') {
    return <PlayScreen play={play} deck={deck} seconds={seconds} tilt={prefs.tilt} sound={prefs.sound} dispatch={dispatch} />;
  }

  return (
    <div className="app">
      <header className="bar">
        <div className="wrap bar-in">
          <div className="brand">
            <h1>Who Be This</h1>
            <p>Hold the phone to your forehead. Your friends give the clues.</p>
          </div>
          <nav className="wbt-nav" aria-label="Games">
            <a className="btn" href="/who-be-this/everyone">Everyone at once</a>
            <a className="btn" href="/">Naija Codes</a>
          </nav>
        </div>
      </header>
      <main className="wrap main">
        {play.phase === 'results' ? (
          <Results
            name={roundName}
            deck={deck}
            answers={play.answers}
            seconds={seconds}
            onNext={() => dispatch({ type: 'home' })}
            onAgain={startRound}
          />
        ) : (
          <Home
            prefs={prefs}
            tiltNote={tiltNote}
            onDeck={(id) => update({ deckId: id })}
            onSeconds={(s: Seconds) => update({ seconds: s })}
            onTilt={toggleTilt}
            onSound={(on) => update({ sound: on })}
            onName={(name) => update({ name })}
            onStart={startRound}
          />
        )}
        <Leaderboard rounds={prefs.rounds} onClear={() => update({ rounds: [] })} />
      </main>
    </div>
  );
}
