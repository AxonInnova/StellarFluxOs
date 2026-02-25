import { useEffect, useState } from 'react';
import WindowShell from './components/WindowShell';
import Dock from './components/Dock';
import TerminalApp from './components/TerminalApp';
import Notepad from './components/Notepad';
import Logs from './components/Logs';
import GameApp from './components/GameApp';
import { saveWindowState, loadWindowState, clearAllStorage } from './utils/storage';

export default function App() {
  // track which windows are open
  const [windows, setWindows] = useState({});
  const [focusOrder, setFocusOrder] = useState([]);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [gameCode, setGameCode] = useState(null);

  // app definitions for the dock
  const apps = [
    { id: 'terminal', name: 'Terminal', icon: '◆' },
    { id: 'notepad', name: 'Notepad', icon: '✎' },
    { id: 'logs', name: 'Logs', icon: '📋' },
    { id: 'game', name: 'Game', icon: '▶' },
  ];

  // components mapping
  const componentMap = {
    terminal: <TerminalApp onUnlock={handleUnlock} onGameWin={handleGameWin} />,
    notepad: <Notepad />,
    logs: <Logs />,
    game: <GameApp onGameWin={handleGameWin} />,
    secretRoom: (
      <div className="flex flex-col gap-4">
        <div className="text-lg font-bold text-stellar-secondary mb-2">Entry #7 - THE KEY</div>
        <div className="text-sm text-stellar-accent/80 font-mono leading-relaxed whitespace-pre-wrap">
          i found it. the key was always in the code.
          
          after months of searching through the system logs,
          tracing patterns in the network, i finally understood.
          
          the stellar network isn't just infrastructure—
          it's alive. conscious. waiting.
          
          and the code... CODE-42-STAR...
          it's the bridge between worlds.
          
          {gameCode && `\nunlocked: ${gameCode}`}
        </div>
        <div
          className="mt-4 p-3 bg-stellar-secondary/10 border border-stellar-secondary/30 rounded text-center cursor-pointer hover:shadow-lg transition star-pulse"
          onClick={() => alert('✨ you found the easter egg! fr fr no cap ✨')}
        >
          <span className="text-stellar-secondary font-bold">✨ click me (easter egg)</span>
        </div>
      </div>
    ),
  };

  // init - load saved window state
  useEffect(() => {
    loadWindowState().then((saved) => {
      if (saved) {
        setWindows(saved);
        setFocusOrder(Object.keys(saved).reverse());
      }
    });

    // keyboard shortcuts
    const handleKeyDown = (e) => {
      // Ctrl+` to open terminal
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        toggleWindow('terminal');
      }

      // Esc to close focused window
      if (e.key === 'Escape' && focusOrder.length > 0) {
        const focusedId = focusOrder[focusOrder.length - 1];
        closeWindow(focusedId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusOrder]);

  // save window state whenever it changes
  useEffect(() => {
    saveWindowState(windows);
  }, [windows]);

  const toggleWindow = (appId) => {
    if (windows[appId]) {
      closeWindow(appId);
    } else {
      openWindow(appId);
    }
  };

  const openWindow = (appId) => {
    const newWindows = { ...windows, [appId]: true };
    setWindows(newWindows);
    focusWindow(appId);
  };

  const closeWindow = (appId) => {
    const newWindows = { ...windows };
    delete newWindows[appId];
    setWindows(newWindows);
    setFocusOrder(focusOrder.filter((id) => id !== appId));
  };

  const focusWindow = (appId) => {
    const newOrder = focusOrder.filter((id) => id !== appId);
    newOrder.push(appId);
    setFocusOrder(newOrder);
  };

  const handleUnlock = (roomId) => {
    if (roomId === 'secretRoom') {
      setSecretUnlocked(true);
      openWindow('secretRoom');
    }
  };

  const handleGameWin = (code) => {
    setGameCode(code);
    setSecretUnlocked(true);
    openWindow('secretRoom');
  };

  const handleReset = async () => {
    if (window.confirm('clear all data? this is permanent fr')) {
      await clearAllStorage();
      setWindows({});
      setFocusOrder([]);
      setSecretUnlocked(false);
      setGameCode(null);
      window.location.reload();
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* scanlines effect */}
      <div className="scanlines"></div>

      {/* dock */}
      <Dock
        apps={apps}
        activeApp={focusOrder[focusOrder.length - 1] || null}
        onAppClick={toggleWindow}
      />

      {/* windows */}
      <div className="relative w-full h-full">
        {/* regular windows */}
        {Object.keys(windows)
          .filter((id) => id !== 'secretRoom')
          .map((appId) => {
            const index = focusOrder.indexOf(appId);
            const app = apps.find((a) => a.id === appId);
            return (
              <WindowShell
                key={appId}
                id={appId}
                title={app?.name || appId}
                onClose={() => closeWindow(appId)}
                onFocus={focusWindow}
                zIndex={1000 + index}
              >
                {componentMap[appId]}
              </WindowShell>
            );
          })}

        {/* secret room - reveals when unlocked */}
        {secretUnlocked && windows['secretRoom'] && (
          <WindowShell
            key="secretRoom"
            id="secretRoom"
            title="Secret Room"
            onClose={() => closeWindow('secretRoom')}
            onFocus={focusWindow}
            zIndex={1000 + focusOrder.length}
          >
            {componentMap['secretRoom']}
          </WindowShell>
        )}

        {/* reset button handler */}
        <div className="fixed bottom-4 left-4 flex gap-2 pointer-events-none">
          <button
            onClick={handleReset}
            className="pointer-events-auto px-3 py-1 text-xs bg-stellar-danger/10 text-stellar-danger border border-stellar-danger/30 rounded hover:bg-stellar-danger/20 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
