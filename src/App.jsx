import { useState, useCallback } from 'react';
import Dock from './components/Dock';
import Desktop from './components/Desktop';

export default function App() {
  const [windows, setWindows] = useState({});
  const [zOrder, setZOrder] = useState([]);
  const [minimized, setMinimized] = useState(new Set());

  const openWindow = useCallback((appId) => {
    setWindows((prev) => {
      if (prev[appId]) {
        setZOrder((z) => {
          const filtered = z.filter((id) => id !== appId);
          return [...filtered, appId];
        });
        setMinimized((m) => {
          const next = new Set(m);
          next.delete(appId);
          return next;
        });
        return prev;
      }
      return { ...prev, [appId]: { position: { x: 100, y: 100 }, size: { w: 600, h: 400 } } };
    });

    if (!windows[appId] || minimized.has(appId)) {
      setZOrder((z) => [...z.filter((id) => id !== appId), appId]);
      setMinimized((m) => {
        const next = new Set(m);
        next.delete(appId);
        return next;
      });
    }
  }, [windows, minimized]);

  const closeWindow = useCallback((appId) => {
    setWindows((prev) => {
      const next = { ...prev };
      delete next[appId];
      return next;
    });
    setZOrder((z) => z.filter((id) => id !== appId));
    setMinimized((m) => {
      const next = new Set(m);
      next.delete(appId);
      return next;
    });
  }, []);

  const minimizeWindow = useCallback((appId) => {
    setMinimized((m) => {
      const next = new Set(m);
      if (next.has(appId)) {
        next.delete(appId);
        setZOrder((z) => [...z.filter((id) => id !== appId), appId]);
      } else {
        next.add(appId);
      }
      return next;
    });
  }, []);

  const focusWindow = useCallback((appId) => {
    setZOrder((z) => {
      const filtered = z.filter((id) => id !== appId);
      return [...filtered, appId];
    });
    setMinimized((m) => {
      const next = new Set(m);
      next.delete(appId);
      return next;
    });
  }, []);

  const moveWindow = useCallback((appId, position) => {
    setWindows((prev) => ({
      ...prev,
      [appId]: { ...prev[appId], position },
    }));
  }, []);

  const resizeWindow = useCallback((appId, size) => {
    setWindows((prev) => ({
      ...prev,
      [appId]: { ...prev[appId], size },
    }));
  }, []);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 overflow-hidden flex">
      <Dock apps={['terminal', 'notepad', 'logs', 'game']} onAppClick={openWindow} openWindows={Object.keys(windows)} />
      <Desktop
        windows={windows}
        zOrder={zOrder}
        minimized={minimized}
        onClose={closeWindow}
        onMinimize={minimizeWindow}
        onFocus={focusWindow}
        onMove={moveWindow}
        onResize={resizeWindow}
      />
    </div>
  );
}
