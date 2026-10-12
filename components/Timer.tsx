import { useEffect, useRef, useState } from 'react';

// Three short beeps via Web Audio, so no audio file is needed.
function beep(ctx: AudioContext) {
  [0, 0.35, 0.7].forEach((delay) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 880;
    gain.gain.value = 0.15;
    osc.connect(gain).connect(ctx.destination);
    const t = ctx.currentTime + delay;
    osc.start(t);
    osc.stop(t + 0.25);
  });
}

// A simple turn timer. It resets whenever resetKey changes, which happens when the turn passes.
export default function Timer({ resetKey }: { resetKey: string }) {
  const [len, setLen] = useState(90);
  const [left, setLeft] = useState(90);
  const [running, setRunning] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setLeft(len);
    setRunning(false);
    setAlertOpen(false);
  }, [len, resetKey]);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (running && left === 0) {
      setRunning(false);
      setAlertOpen(true);
      if (audioRef.current) beep(audioRef.current);
    }
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
    // Create the audio context on a click so the browser allows sound later.
    if (!audioRef.current) audioRef.current = new AudioContext();
    audioRef.current.resume();
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
      {alertOpen && (
        <div className="timer-alert" role="alertdialog" aria-modal="true" aria-labelledby="timer-alert-title">
          <div className="box">
            <h2 id="timer-alert-title">Time&apos;s up!</h2>
            <p>Pass the turn to the next team.</p>
            <button type="button" className="btn" autoFocus onClick={() => setAlertOpen(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
