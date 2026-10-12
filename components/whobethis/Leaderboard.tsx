import { useEffect, useState } from 'react';
import { deckById } from '../../lib/whobethis/decks';
import type { Round } from '../../lib/whobethis/engine';

export default function Leaderboard({ rounds, onClear }: { rounds: Round[]; onClear: () => void }) {
  const [sure, setSure] = useState(false);

  useEffect(() => {
    if (!sure) return undefined;
    const id = setTimeout(() => setSure(false), 3500);
    return () => clearTimeout(id);
  }, [sure]);

  if (rounds.length === 0) return null;
  const top = rounds
    .slice()
    .sort((a, b) => b.score - a.score || b.at - a.at)
    .slice(0, 8);

  return (
    <section className="wbt-section" aria-label="Scores tonight">
      <h2 className="wbt-h">Scores tonight</h2>
      <ol className="wbt-board">
        {top.map((r, i) => (
          <li key={r.at + '-' + i}>
            <span className="who">{r.name}</span>
            <span className="deck">{deckById(r.deckId).name}</span>
            <b>{r.score}</b>
          </li>
        ))}
      </ol>
      <button
        type="button"
        className="btn small"
        onClick={() => {
          if (!sure) {
            setSure(true);
            return;
          }
          setSure(false);
          onClear();
        }}
      >
        {sure ? 'Tap again to clear' : 'Clear scores'}
      </button>
    </section>
  );
}
