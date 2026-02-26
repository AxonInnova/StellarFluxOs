import { useState, useCallback } from 'react';

const logs = [
  {
    id: 'log_001',
    title: 'System Boot Log',
    content: 'SYSTEM INITIATED\n\nCore Systems Check:\n✓ CPU: Nominal\n✓ Memory: 8.2GB / 16GB\n✓ Network: Connected\n✓ Storage: 512GB SSD\n\nAll systems operational. Welcome back, operator.',
  },
  {
    id: 'log_002',
    title: 'Network Trace',
    content: 'NETWORK ANALYSIS\n\nConnectivity Status:\n- Ping response: 4ms\n- Signal strength: 99%\n- Encryption: AES-256 active\n- Uplink: Stable\n- Last sync: 2 minutes ago\n\nNo anomalies detected.',
  },
  {
    id: 'log_003',
    title: 'Memory Dump',
    content: 'MEMORY DIAGNOSTICS\n\nMemory Usage:\n- Allocated: 8.2GB / 16GB (51.25%)\n- Cache hit rate: 94.2%\n- L3 Cache: 97% effective\n- Page faults: 0\n\nPerformance: Excellent\nThermal: 42°C normal',
  },
];

export default function Logs() {
  const [selectedLog, setSelectedLog] = useState(null);

  const handleSelectLog = useCallback((log) => {
    setSelectedLog(log);
  }, []);

  return (
    <div className="flex h-full gap-4">
      <div className="w-1/3 border-r border-stellar-accent/10 overflow-y-auto pr-3">
        <div className="text-xs text-stellar-accent/60 mb-3 font-mono">Available Logs</div>
        {logs.map((log) => (
          <button
            key={log.id}
            onClick={() => handleSelectLog(log)}
            className={`w-full text-left px-3 py-2 rounded mb-2 transition text-sm ${
              selectedLog?.id === log.id
                ? 'bg-stellar-accent/20 text-stellar-accent border border-stellar-accent/50'
                : 'bg-stellar-darker/30 text-stellar-accent/70 hover:bg-stellar-darker/50'
            }`}
          >
            <div className="font-mono text-xs text-stellar-secondary">{log.id}</div>
            <div className="text-stellar-accent/90">{log.title}</div>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedLog ? (
          <div>
            <div className="text-xs text-stellar-secondary/70 mb-3 font-mono">{selectedLog.title}</div>
            <div className="text-sm text-stellar-accent/80 font-mono whitespace-pre-wrap leading-relaxed">
              {selectedLog.content}
            </div>
          </div>
        ) : (
          <div className="text-stellar-accent/40 text-sm">Select a log to view</div>
        )}
      </div>
    </div>
  );
}
