import { useState } from 'react';

export default function Terminal({ userId, deviceSpecs }) {
  const [history, setHistory] = useState(['> welcome to StellarFlux OS', '> type "help" for commands fr']);
  const [input, setInput] = useState('');

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    let response = '';

    // command routing - keep it simple no cap
    if (trimmed === 'help') {
      response = 'commands: help | scan | clear | system | uname | whoami | pwd';
    } else if (trimmed === 'scan') {
      response = 'scanning... 3 logs found: [log_001] [log_002] [log_003]';
    } else if (trimmed === 'system') {
      response = 'StellarFlux OS v0.1.0 | Stable | All systems nominal';
    } else if (trimmed === 'uname') {
      // uname with device specs if available
      let unameLine = 'StellarFlux Linux localhost 0.1.0 #1';
      if (deviceSpecs) {
        unameLine += ` [${deviceSpecs.hardwareConcurrency}-core | ${deviceSpecs.deviceMemory}GB RAM]`;
        unameLine += ` [${deviceSpecs.screen.width}x${deviceSpecs.screen.height}]`;
      }
      response = unameLine;
    } else if (trimmed === 'whoami') {
      response = userId ? userId.substring(0, 8) : 'guest_user';
    } else if (trimmed === 'pwd') {
      response = '/home/user/os';
    } else if (trimmed === 'clear') {
      response = 'clear';
    } else if (trimmed.startsWith('echo ')) {
      response = trimmed.slice(5);
    } else {
      response = `command not found: ${trimmed} // try "help"`;
    }

    if (trimmed === 'clear') {
      setHistory([]);
    } else {
      setHistory((h) => [...h, `> ${trimmed}`, response]);
    }
    setInput('');
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-y-auto mb-3 space-y-1">
        {history.map((line, i) => (
          <div
            key={i}
            className={
              line.startsWith('>')
                ? 'text-cyan-300 font-mono text-xs'
                : 'text-slate-300 font-mono text-xs'
            }
          >
            {line}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-cyan-500/10 pt-2">
        <span className="text-cyan-400 font-mono">{'>'}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
          className="flex-1 bg-transparent outline-none text-cyan-300 font-mono text-xs placeholder-slate-500"
          placeholder="type command..."
          autoFocus
        />
      </div>
    </div>
  );
}
