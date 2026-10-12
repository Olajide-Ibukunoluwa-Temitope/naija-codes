import type { Deck } from '../../lib/whobethis/decks';

export default function Countdown({ count, deck, tilt }: { count: number; deck: Deck; tilt: boolean }) {
  return (
    <div
      className="wbt-count"
      style={{ '--deck-bg': deck.bg, '--deck-fg': deck.fg } as React.CSSProperties}
      role="status"
      aria-live="polite"
    >
      <div className="wbt-count-num">{count > 0 ? count : 'Go'}</div>
      <p className="wbt-count-tip">Hold the phone to your forehead, screen facing your friends.</p>
      <p className="wbt-count-tip wbt-turn">Turn your phone sideways for the biggest words.</p>
      <p className="wbt-count-tip">
        {tilt ? 'Tilt down when you get it. Tilt up to pass.' : 'Friends tap Got it or Pass, or use the arrow keys.'}
      </p>
    </div>
  );
}
