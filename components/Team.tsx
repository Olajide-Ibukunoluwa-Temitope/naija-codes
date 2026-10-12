import { TEAM_NAME, type GameState, type TeamId } from '../lib/game';

type Props = {
  id: TeamId;
  left: number;
  st: GameState;
  first: boolean;
  spy: boolean;
};

export default function Team({ id, left, st, first, spy }: Props) {
  const active = !spy && !st.over && st.turn === id;
  const won = !spy && st.winner === id;
  let status = '';
  if (!spy) {
    if (won) status = 'Winner';
    else if (active) status = 'Guessing now';
    else if (st.over) status = 'Finished';
    else status = 'Waiting';
  }
  const sub = (spy ? 'cards to find' : 'cards left') + (first ? ', goes first' : ', goes second');

  return (
    <div
      className={'team t-' + id + (active || won ? ' on' : '')}
      role="group"
      aria-label={`${TEAM_NAME[id]}: ${left} ${sub}${status ? '. ' + status : ''}`}
    >
      <div className="num" aria-hidden="true">{left}</div>
      <div className="who">
        <div className="name">{TEAM_NAME[id]}</div>
        {status ? <div className="state first">{status}</div> : null}
        <div className="state">{sub}</div>
      </div>
    </div>
  );
}
