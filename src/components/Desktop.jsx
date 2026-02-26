import Window from './Window';
import Terminal from './apps/Terminal';
import Notepad from './apps/Notepad';
import Logs from './apps/Logs';
import Game from './apps/Game';

const appMap = {
  terminal: { name: 'Terminal', component: Terminal },
  notepad: { name: 'Notepad', component: Notepad },
  logs: { name: 'Logs', component: Logs },
  game: { name: 'Game', component: Game },
};

export default function Desktop({
  windows,
  zOrder,
  minimized,
  onClose,
  onMinimize,
  onFocus,
  onMove,
  onResize,
}) {
  return (
    <div className="flex-1 relative overflow-hidden">
      {zOrder.map((appId) => {
        if (!windows[appId]) return null;
        const isMinimized = minimized.has(appId);
        const app = appMap[appId];
        const zIndex = zOrder.indexOf(appId) + 1;

        return (
          <Window
            key={appId}
            id={appId}
            title={app.name}
            zIndex={zIndex * 10}
            minimized={isMinimized}
            onClose={() => onClose(appId)}
            onMinimize={() => onMinimize(appId)}
            onFocus={() => onFocus(appId)}
            onMove={(pos) => onMove(appId, pos)}
            position={windows[appId].position}
          >
            {!isMinimized && app.component && <app.component />}
          </Window>
        );
      })}
    </div>
  );
}
