import { useEffect, useRef, type Dispatch } from 'react';
import FitText from './FitText';
import type { Deck } from '../../lib/whobethis/decks';
import { scoreOf, type Action, type Play } from '../../lib/whobethis/engine';
import { buzz, sfx, useTilt } from '../../lib/whobethis/device';

type Props = {
  play: Play;
  deck: Deck;
  seconds: number;
  tilt: boolean;
  sound: boolean;
  dispatch: Dispatch<Action>;
};

export default function PlayScreen({ play, deck, seconds, tilt, sound, dispatch }: Props) {
  const word = play.queue[play.idx] ?? '';
  const score = scoreOf(play.answers);
  const locked = play.feedback !== null;
  const low = play.secsLeft <= 10;

  const answer = (ok: boolean) => {
    if (locked) return;
    dispatch({ type: 'answer', ok });
    if (sound) (ok ? sfx.correct : sfx.pass)();
    buzz(ok ? 60 : 30);
  };

  // Keep the latest answer function for the keyboard and tilt listeners.
  const answerRef = useRef(answer);
  useEffect(() => {
    answerRef.current = answer;
  });

  const sensor = useTilt(tilt, (dir) => answerRef.current(dir === 'down'));

  // The clock. It runs from real time, so a slow phone never stretches the round.
  useEffect(() => {
    const id = setInterval(() => dispatch({ type: 'tick', now: Date.now() }), 100);
    return () => clearInterval(id);
  }, [dispatch]);

  // After a Got it or Pass, show the result for a moment, then move to the next card.
  useEffect(() => {
    if (!play.feedback) return undefined;
    const id = setTimeout(() => dispatch({ type: 'next' }), 520);
    return () => clearTimeout(id);
  }, [play.feedback, dispatch]);

  // A tick for each of the last five seconds.
  useEffect(() => {
    if (sound && play.secsLeft > 0 && play.secsLeft <= 5) sfx.tick();
  }, [play.secsLeft, sound]);

  // Arrow keys for laptop and TV play. Right is Got it, left is Pass.
  useEffect(() => {
    (document.activeElement as HTMLElement | null)?.blur?.();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        answerRef.current(true);
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault();
        answerRef.current(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div
      className="wbt-play"
      style={{ '--deck-bg': deck.bg, '--deck-fg': deck.fg, '--dur': seconds + 's' } as React.CSSProperties}
    >
      <div className="wbt-top">
        <button type="button" className="wbt-quit" onClick={() => dispatch({ type: 'home' })}>
          Quit
        </button>
        <div className={'wbt-chip wbt-time' + (low ? ' low' : '')} role="timer" aria-label={`${play.secsLeft} seconds left`}>
          {play.secsLeft}
        </div>
        <div className="wbt-chip wbt-got">{score} got it</div>
      </div>
      <div className="wbt-progress" aria-hidden="true">
        <i key={play.endAt} />
      </div>

      <div className="wbt-word">
        <FitText text={word} />
      </div>

      {tilt && sensor === 'none' ? (
        <p className="wbt-note">No tilt sensor found. Use the buttons or the arrow keys.</p>
      ) : null}

      <div className="wbt-actions">
        <button type="button" className="wbt-act" onClick={() => answer(false)} disabled={locked}>
          Pass
        </button>
        <button type="button" className="wbt-act ok" onClick={() => answer(true)} disabled={locked}>
          Got it
        </button>
      </div>

      {play.feedback ? (
        <div className={'wbt-flash ' + play.feedback} aria-hidden="true">
          <b>{play.feedback === 'ok' ? 'Got it' : 'Pass'}</b>
          <span>{word}</span>
        </div>
      ) : null}
    </div>
  );
}
