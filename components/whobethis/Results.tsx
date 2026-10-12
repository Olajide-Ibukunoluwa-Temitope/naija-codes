import type { Deck } from '../../lib/whobethis/decks';
import { scoreOf, type Answer } from '../../lib/whobethis/engine';

type Props = {
  name: string;
  deck: Deck;
  answers: Answer[];
  seconds: number;
  onNext: () => void;
  onAgain: () => void;
};

export default function Results({ name, deck, answers, seconds, onNext, onAgain }: Props) {
  const score = scoreOf(answers);
  const got = answers.filter((a) => a.ok);
  const passed = answers.filter((a) => !a.ok);

  return (
    <section className="wbt-section" aria-label="Round results">
      <div className="wbt-result" style={{ '--deck-bg': deck.bg, '--deck-fg': deck.fg } as React.CSSProperties}>
        <p className="who">{name}</p>
        <div className="big" aria-label={`${score} guessed`}>{score}</div>
        <p className="sub">
          {score === 1 ? 'card' : 'cards'} guessed in {seconds} seconds. Deck: {deck.name}.
        </p>
      </div>

      <div className="wbt-lists">
        <div>
          <h3 className="wbt-h">Got it ({got.length})</h3>
          {got.length ? (
            <ul className="wbt-list ok">
              {got.map((a, i) => (
                <li key={i}>{a.word}</li>
              ))}
            </ul>
          ) : (
            <p className="wbt-empty">None this round.</p>
          )}
        </div>
        <div>
          <h3 className="wbt-h">Passed ({passed.length})</h3>
          {passed.length ? (
            <ul className="wbt-list pass">
              {passed.map((a, i) => (
                <li key={i}>{a.word}</li>
              ))}
            </ul>
          ) : (
            <p className="wbt-empty">No passes. Nice.</p>
          )}
        </div>
      </div>

      <div className="wbt-resultbtns">
        <button type="button" className="btn solid wbt-go" onClick={onNext}>Next player</button>
        <button type="button" className="btn" onClick={onAgain}>Play again</button>
      </div>
    </section>
  );
}
