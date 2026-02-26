export default function Dock({ apps, onAppClick, openWindows }) {
  const appConfig = {
    terminal: { name: 'Terminal', icon: '◆' },
    notepad: { name: 'Notepad', icon: '✎' },
    logs: { name: 'Logs', icon: '📋' },
    game: { name: 'Game', icon: '▶' },
  };

  return (
    <div className="w-20 bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-r border-cyan-500/10 flex flex-col items-center py-4 gap-3 shadow-lg">
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
    </div>
  );
}
