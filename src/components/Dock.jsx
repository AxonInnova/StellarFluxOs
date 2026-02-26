import { signOut } from '../lib/auth';

// dock launcher - left sidebar fr
// this is where you go to open stuff
export default function Dock({ apps, onAppClick, openWindows, user }) {
  const appConfig = {
    terminal: { name: 'Terminal', icon: '◆' },
    notepad: { name: 'Notepad', icon: '✎' },
    logs: { name: 'Logs', icon: '📋' },
    game: { name: 'Game', icon: '▶' },
    files: { name: 'Files', icon: '📁' },
  };

  const handleLogout = async () => {
    if (!confirm('sign out? // bye fr')) return;
    await signOut();
  };

  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL || import.meta.env.MODE !== 'production';

  return (
    <div className="w-20 bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-r border-cyan-500/10 flex flex-col items-center py-4 gap-3 shadow-lg relative z-40">
      {/* app launcher buttons */}
      {apps.map((appId) => {
        const config = appConfig[appId];
        const isOpen = openWindows.includes(appId);

        return (
          <button
            key={appId}
            onClick={() => onAppClick(appId)}
            className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all duration-200 font-mono text-xl ${
              isOpen
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-800/50 text-slate-400 border border-cyan-500/10 hover:bg-slate-700/50 hover:text-cyan-300'
            }`}
            title={config.name}
          >
            {config.icon}
          </button>
        );
      })}

      {/* spacer */}
      <div className="flex-1" />

      {/* bottom bar - user info & logout */}
      <div className="border-t border-cyan-500/10 pt-2 space-y-2 w-full flex flex-col items-center px-2">
        {isAdmin && (
          <div className="text-xs text-yellow-400 font-mono text-center px-2 py-1 bg-yellow-500/10 rounded border border-yellow-500/20">
            ⚙ ADMIN
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800/50 text-slate-400 border border-cyan-500/10 hover:bg-red-500/20 hover:text-red-300 transition text-sm"
          title="Logout"
        >
          ⟴
        </button>
      </div>
    </div>
  );
}
