import Window from './Window';
import Terminal from './apps/Terminal';
import Notepad from './apps/Notepad';
import Logs from './apps/Logs';
import Game from './apps/Game';
import Files from './apps/Files';
import Admin from './apps/Admin';

// app registry - add new apps here no cap
const appMap = {
  terminal: { name: 'Terminal', component: Terminal },
  notepad: { name: 'Notepad', component: Notepad },
  logs: { name: 'Logs', component: Logs },
  game: { name: 'Game', component: Game },
  files: { name: 'Files', component: Files },
  admin: { name: 'Admin', component: Admin },
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
  userId,
  userEmail,
  deviceSpecs,
  isAdmin,
}) {
  return (
    <div className="flex-1 relative overflow-hidden">
      {zOrder.map((appId) => {
        if (!windows[appId]) return null;
        const isMinimized = minimized.has(appId);
        const app = appMap[appId];
        if (!app) return null; // skip unknown apps
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
            {!isMinimized && app.component && (
              <app.component
                userId={userId}
                userEmail={userEmail}
                deviceSpecs={deviceSpecs}
                isAdmin={isAdmin}
              />
            )}
          </Window>
        );
      })}
    </div>
  );
}
