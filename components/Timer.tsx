import { useEffect, useState } from 'react';

// A simple turn timer. It resets whenever resetKey changes, which happens when the turn passes.
export default function Timer({ resetKey }: { resetKey: string }) {
  const [len, setLen] = useState(90);
  const [left, setLeft] = useState(90);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setLeft(len);
    setRunning(false);
  }, [len, resetKey]);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (running && left === 0) setRunning(false);
  }, [running, left]);

  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, '0');
  const cls = 'timer' + (left === 0 ? ' up' : running && left <= 10 ? ' low' : '');

  let label = 'Resume';
  if (running) label = 'Pause';
  else if (left === 0) label = 'Restart';
  else if (left === len) label = 'Start';

  const toggle = () => {
    if (running) {
      setRunning(false);
      return;
    }
    if (left === 0) setLeft(len);
    setRunning(true);
  };

  return (
    <div className={cls}>
      <span className="t" role="timer">{mm}:{ss}</span>
      <button type="button" className="btn small" onClick={toggle}>{label}</button>
      <button
        type="button"
        className="btn small"
        onClick={() => {
          setLeft(len);
          setRunning(false);
        }}
      >
        Reset
      </button>
      <select id="timer-len" aria-label="Timer length" value={len} onChange={(e) => setLen(Number(e.target.value))}>
        <option value={60}>60 s</option>
        <option value={90}>90 s</option>
        <option value={120}>2 min</option>
      </select>
    </div>
  );
}
