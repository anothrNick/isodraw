import { useEffect, useState } from 'react';
import { IsoDiagramEditor, emptyDiagram, type Diagram, type IconDef } from '../lib';
import { sampleDiagram } from './sample';

const KEY = 'isodraw-demo:diagram';
const ICONS_KEY = 'isodraw-demo:icons';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function App() {
  const [diagram, setDiagram] = useState<Diagram>(() => load(KEY, sampleDiagram));
  const [icons, setIcons] = useState<IconDef[]>(() => load(ICONS_KEY, []));
  // Remounting the editor re-fits the camera after a reset.
  const [epoch, setEpoch] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(diagram));
    } catch {
      /* storage full or unavailable */
    }
  }, [diagram]);
  useEffect(() => {
    try {
      localStorage.setItem(ICONS_KEY, JSON.stringify(icons));
    } catch {
      /* storage full or unavailable */
    }
  }, [icons]);

  const reset = (d: Diagram) => {
    setDiagram(d);
    setEpoch((e) => e + 1);
  };

  return (
    <div className="demo">
      <header className="demo-header">
        <div className="demo-brand">
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2 3 7l9 5 9-5-9-5Z" fill="#60a5fa" />
            <path d="M3 7v10l9 5V12L3 7Z" fill="#2563eb" />
            <path d="M21 7v10l-9 5V12l9-5Z" fill="#1d4ed8" />
          </svg>
          <strong>IsoDraw</strong>
          <span>Cloudcraft-style diagrams for React</span>
        </div>
        <div className="demo-actions">
          <button type="button" onClick={() => reset(sampleDiagram)}>Load sample</button>
          <button type="button" onClick={() => reset(emptyDiagram())}>New blank</button>
        </div>
      </header>
      <main className="demo-main">
        <IsoDiagramEditor
          key={epoch}
          value={diagram}
          onChange={setDiagram}
          userIcons={icons}
          onUserIconsChange={setIcons}
        />
      </main>
    </div>
  );
}
