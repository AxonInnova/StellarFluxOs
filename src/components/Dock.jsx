// left side dock with app icons
// click to open/focus apps no cap
export default function Dock({ apps, activeApp, onAppClick, onReset }) {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
      {/* dock container */}
      <div className="flex flex-col gap-3 bg-stellar-darker/50 backdrop-blur-md border border-stellar-accent/20 rounded-2xl p-3 shadow-2xl">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => onAppClick(app.id)}
            className={`
              w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer font-mono font-bold text-lg
              ${activeApp === app.id
                ? 'bg-stellar-secondary/40 text-stellar-accent scale-110 shadow-lg shadow-stellar-secondary/50'
                : 'bg-stellar-accent/10 text-stellar-accent/70 hover:bg-stellar-accent/20 hover:text-stellar-accent'
              }
            `}
            title={app.name}
          >
            {app.icon}
          </button>
        ))}
      </div>

      {/* bottom section - reset button */}
      <div className="flex flex-col gap-2 bg-stellar-darker/50 backdrop-blur-md border border-stellar-danger/20 rounded-2xl p-2">
        <button
          onClick={onReset}
          title="Reset all data"
          className="w-12 h-12 flex items-center justify-center rounded-xl text-stellar-danger/60 hover:text-stellar-danger hover:bg-stellar-danger/10 transition text-xl"
        >
          ⟲
        </button>
      </div>
    </div>
  );
}
