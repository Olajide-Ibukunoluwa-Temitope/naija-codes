import { useEffect, useMemo, useState } from 'react';
import Card from './Card';
import Header, { type Confirm } from './Header';
import Help from './Help';
import Team from './Team';
import Timer from './Timer';
import {
  TEAM_NAME,
  derive,
  makeBoard,
  packOf,
  randomCode,
  type Mode,
  type Saved,
} from '../lib/game';
import type { PackKey } from '../lib/words';
import { saveState } from '../lib/storage';

export default function Game({ initial }: { initial: Saved }) {
  const [code, setCode] = useState(initial.code);
  const [log, setLog] = useState(initial.log);
  const [mode, setMode] = useState<Mode>(initial.mode);
  const [marks, setMarks] = useState<Set<number>>(() => new Set());
  const [confirming, setConfirming] = useState<Confirm>(null);

  const pack = packOf(code);
  const board = useMemo(() => makeBoard(code), [code]);
  const st = useMemo(() => derive(board, log), [board, log]);
  const spy = mode === 'spy';

  useEffect(() => {
    saveState({ code, log, mode });
  }, [code, log, mode]);

  // A confirm prompt ("Tap again") goes away on its own after a few seconds.
  useEffect(() => {
    if (!confirming) return undefined;
    const id = setTimeout(() => setConfirming(null), 3500);
    return () => clearTimeout(id);
  }, [confirming]);

  const resetPlay = (c: string) => {
    setCode(c);
    setLog([]);
    setMarks(new Set());
    setConfirming(null);
  };
  const loadCode = (c: string) => {
    if (c !== code) resetPlay(c);
  };
  const newGame = () => {
    if (log.length > 0 && confirming !== 'new') {
      setConfirming('new');
      return;
    }
    resetPlay(randomCode(pack));
  };
  const switchPack = (p: PackKey) => {
    if (p === pack) return;
    const ask: Confirm = `pack${p}`;
    if (log.length > 0 && confirming !== ask) {
      setConfirming(ask);
      return;
    }
    resetPlay(randomCode(p));
  };
  const tapCard = (i: number) => {
    if (spy) {
      setMarks((m) => {
        const n = new Set(m);
        if (n.has(i)) n.delete(i);
        else n.add(i);
        return n;
      });
      return;
    }
    if (st.over || st.revealed.has(i)) return;
    setLog((l) => l.concat([{ t: 'r', i }]));
  };
  const endTurn = () => {
    if (!st.over) setLog((l) => l.concat([{ t: 'e' }]));
  };
  const undo = () => setLog((l) => l.slice(0, -1));

  // On a spymaster phone the score counts cards that are not crossed off yet.
  const spyLeft = { g: 0, y: 0 };
  board.key.forEach((k, i) => {
    if ((k === 'g' || k === 'y') && !marks.has(i)) spyLeft[k] += 1;
  });
  const left = spy ? spyLeft : st.left;

  const bannerTitle = st.winner ? TEAM_NAME[st.winner] + ' wins' : '';
  const bannerText = st.assassinBy
    ? TEAM_NAME[st.assassinBy] + ' uncovered the assassin.'
    : 'Every card found. Start a new game, or press Undo if that was a mistake.';

  return (
    <div className="app">
      <Header
        code={code}
        pack={pack}
        confirming={confirming}
        canChange={!spy}
        onLoad={loadCode}
        onNew={newGame}
        onPack={switchPack}
      />
      <main className="wrap main">
        <section className="score" aria-label="Score">
          <Team id="g" left={left.g} st={st} first={board.first === 'g'} spy={spy} />
          <Team id="y" left={left.y} st={st} first={board.first === 'y'} spy={spy} />
        </section>

        {!spy && st.over ? (
          <div className="banner" role="status">
            <strong>{bannerTitle}</strong>
            <span>{bannerText}</span>
          </div>
        ) : null}
        {spy ? (
          <p className="spy-note">
            <strong>Spymaster key.</strong> Keep this screen hidden from your team. Tap a card to cross it off once it has
            been played. Crossing off only changes this device.
          </p>
        ) : null}

        <div className="board-wrap">
          <div className={'board mode-' + mode} role="group" aria-label="Word board">
            {board.words.map((w, i) => (
              <Card
                key={i}
                word={w}
                kind={board.key[i]}
                revealed={!spy && st.revealed.has(i)}
                spy={spy}
                marked={marks.has(i)}
                over={!spy && st.over}
                onTap={() => tapCard(i)}
              />
            ))}
          </div>
        </div>

        <div className="controls">
          <div className="group">
            {spy ? (
              <button type="button" className="btn" onClick={() => setMarks(new Set())} disabled={marks.size === 0}>
                Clear crossed off
              </button>
            ) : (
              <>
                <button type="button" className="btn" onClick={undo} disabled={log.length === 0}>Undo</button>
                <button type="button" className="btn" onClick={endTurn} disabled={st.over}>End turn</button>
                <Timer resetKey={st.turn + (st.over ? '-over' : '')} />
              </>
            )}
          </div>
          <div className="seg" role="group" aria-label="Screen type">
            <button type="button" aria-pressed={!spy} onClick={() => setMode('board')}>Board</button>
            <button type="button" aria-pressed={spy} onClick={() => setMode('spy')}>Spymaster</button>
          </div>
        </div>

        <Help />
      </main>
    </div>
  );
}
