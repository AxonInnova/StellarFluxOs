import { useState } from 'react';

export default function Logs() {
  const [selected, setSelected] = useState('log_001');

  const logs = {
    log_001: { title: 'System Boot', content: 'StellarFlux OS initialized successfully.\nAll subsystems operational.\nReady for commands.' },
    log_002: { title: 'Network Status', content: 'Connection stable.\nLatency: 4ms\nSignal: 99%\nEncryption: AES-256' },
    log_003: { title: 'Memory Report', content: 'RAM: 8.2GB / 16GB\nCache hit: 94.2%\nThermage: 42°C\nStatus: Nominal' },
  };

  return (
    <div className="w-full h-full flex gap-3">
      <div className="w-1/3 border-r border-cyan-500/10 pr-3">
        <div className="text-xs text-slate-500 mb-2">Available Logs</div>
        <div className="space-y-1">
          {Object.entries(logs).map(([id, log]) => (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`w-full text-left px-2 py-1 rounded text-xs font-mono transition ${
                selected === id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {log.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="text-xs text-slate-500 mb-2">{logs[selected].title}</div>
        <div className="text-sm text-slate-300 whitespace-pre-wrap">{logs[selected].content}</div>
      </div>
    </div>
  );
}
