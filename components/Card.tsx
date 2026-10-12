import { KIND_NAME, type Kind } from '../lib/game';

type Props = {
  word: string;
  kind: Kind;
  revealed: boolean;
  spy: boolean;
  marked: boolean;
  over: boolean;
  onTap: () => void;
};

export default function Card({ word, kind, revealed, spy, marked, over, onTap }: Props) {
  const showKind = revealed || spy || over;
  const cls = ['card'];
  if (showKind) cls.push('k-' + kind);
  if (revealed) cls.push('is-revealed');
  if (over && !revealed && !spy) cls.push('is-faded');
  if (spy && marked) cls.push('is-marked');

  let state = 'not played';
  if (revealed) state = KIND_NAME[kind] + ', revealed';
  else if (spy) state = KIND_NAME[kind] + (marked ? ', crossed off' : '');
  else if (over) state = KIND_NAME[kind];

  const disabled = !spy && (revealed || over);

  return (
    <button type="button" className={cls.join(' ')} disabled={disabled} onClick={onTap} aria-label={`${word}, ${state}`}>
      <span className="mark" aria-hidden="true"></span>
      <span className="word">{word}</span>
    </button>
  );
}
