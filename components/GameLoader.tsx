'use client';

import { useEffect, useState } from 'react';
import Game from './Game';
import { sanitize, type Saved } from '../lib/game';
import { loadSaved } from '../lib/storage';

// The saved game lives in the browser, so it can only be read after the page loads.
export default function GameLoader() {
  const [initial, setInitial] = useState<Saved | null>(null);

  useEffect(() => {
    setInitial(sanitize(loadSaved()));
  }, []);

  if (!initial) return <p className="boot">Loading the board...</p>;
  return <Game initial={initial} />;
}
