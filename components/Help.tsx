import type { Kind } from '../lib/game';

const LEGEND: [Kind, string, string][] = [
  ['g', 'Green team', 'flag mark'],
  ['y', 'Danfo team', 'black bar'],
  ['n', 'Neutral', 'no mark'],
  ['x', 'Assassin', 'X mark'],
];

export default function Help() {
  return (
    <details className="help" open>
      <summary>How to play tonight</summary>
      <div className="help-grid">
        <div>
          <h3>Set up</h3>
          <ol>
            <li>Put this page on the big screen. Pick a word pack, tap New game and read out the game code.</li>
            <li>
              Each team picks a spymaster. They open this link on their phone, type the code, tap Load, then switch to
              Spymaster. The first letter of the code sets the pack, so their words match.
            </li>
            <li>Spymasters see which cards belong to which team. Everyone else watches the big screen.</li>
          </ol>
        </div>
        <div>
          <h3>Each turn</h3>
          <ol>
            <li>The spymaster says one word and one number. The number is how many cards the clue points to.</li>
            <li>
              The team talks it over, then someone taps a card on the big screen. They can make one more guess than the
              number.
            </li>
            <li>
              Your own color: keep going, or tap End turn. Neutral or the other team&apos;s color: the turn passes.
              Assassin: your team loses.
            </li>
            <li>The first team to uncover all of its cards wins.</li>
          </ol>
        </div>
        <div>
          <h3>Card colors</h3>
          <ul className="legend">
            {LEGEND.map(([k, name, mark]) => (
              <li key={k}>
                <span className={'sw k-' + k}><b className="mark"></b></span>
                <span><strong>{name}</strong>, {mark}</span>
              </li>
            ))}
          </ul>
          <p>The team that goes first has 9 cards. The other team has 8. There are 7 neutral cards and 1 assassin.</p>
          <p>Tapped the wrong card? Press Undo.</p>
        </div>
      </div>
    </details>
  );
}
