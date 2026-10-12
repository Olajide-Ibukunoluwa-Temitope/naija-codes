import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

// Shows text as large as it can be while still fitting inside its box.
export default function FitText({ text }: { text: string }) {
  const box = useRef<HTMLDivElement>(null);
  const span = useRef<HTMLSpanElement>(null);

  const fit = useCallback(() => {
    const b = box.current;
    const s = span.current;
    if (!b || !s) return;
    let lo = 12;
    let hi = Math.max(24, Math.min(b.clientHeight, 420));
    for (let i = 0; i < 14; i++) {
      const mid = (lo + hi) / 2;
      s.style.fontSize = mid + 'px';
      if (s.scrollWidth <= b.clientWidth + 1 && s.offsetHeight <= b.clientHeight) lo = mid;
      else hi = mid;
    }
    s.style.fontSize = Math.floor(lo) + 'px';
  }, []);

  useLayoutEffect(() => {
    fit();
  }, [text, fit]);

  useEffect(() => {
    const b = box.current;
    if (!b || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => fit());
    ro.observe(b);
    return () => ro.disconnect();
  }, [fit]);

  return (
    <div ref={box} className="wbt-fit">
      <span ref={span}>{text}</span>
    </div>
  );
}
