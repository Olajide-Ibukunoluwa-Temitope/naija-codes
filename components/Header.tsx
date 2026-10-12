import { useEffect, useState, type FormEvent } from 'react';
import { PACKS, PACK_ORDER, type PackKey } from '../lib/words';
import { cleanCode } from '../lib/game';

export type Confirm = null | 'new' | `pack${PackKey}`;

type Props = {
  code: string;
  pack: PackKey;
  confirming: Confirm;
  canChange: boolean;
  onLoad: (code: string) => void;
  onNew: () => void;
  onPack: (pack: PackKey) => void;
};

export default function Header({ code, pack, confirming, canChange, onLoad, onNew, onPack }: Props) {
  const [draft, setDraft] = useState(code);
  const [hint, setHint] = useState('');

  useEffect(() => {
    setDraft(code);
    setHint('');
  }, [code]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const c = cleanCode(draft);
    if (c.length < 3) {
      setHint('Use 3 to 8 letters or numbers.');
      return;
    }
    setHint('');
    onLoad(c);
  };

  return (
    <header className="bar">
      <div className="wrap bar-in">
        <div className="brand">
          <h1>Naija Codes</h1>
          <p>A word game for two teams. Built for games night.</p>
          <p className="switch"><a className="btn"href="/who-be-this">Switch to Who Be This</a></p>
        </div>
        <form className="codeform" onSubmit={submit}>
          <label htmlFor="game-code">Game code</label>
          <div className="codeline">
            <input
              id="game-code"
              value={draft}
              maxLength={8}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              onChange={(e) => setDraft(cleanCode(e.target.value))}
            />
            <button type="submit" className="btn">Load</button>
            <button type="button" className="btn solid" disabled={!canChange} onClick={onNew}>
              {confirming === 'new' ? 'Tap again to confirm' : 'New game'}
            </button>
          </div>
          <div className="packline">
            <span className="lbl" id="pack-label">Words</span>
            <div className="seg" role="group" aria-labelledby="pack-label">
              {PACK_ORDER.map((k) => (
                <button key={k} type="button" aria-pressed={pack === k} disabled={!canChange} onClick={() => onPack(k)}>
                  {confirming === `pack${k}` ? 'Tap again' : PACKS[k].name}
                </button>
              ))}
            </div>
          </div>
          <p className="hint" role="status">
            {hint || PACKS[pack].blurb + (canChange ? '' : ' Switch to Board to start a new game.')}
          </p>
        </form>
      </div>
    </header>
  );
}
