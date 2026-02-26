import { useState } from 'react';

export default function Terminal() {
  const [history, setHistory] = useState(['> welcome to StellarFlux OS']);
  const [input, setInput] = useState('');

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const responses = {
      help: 'available commands: help, scan, clear, system',
      scan: 'scanning... 3 logs found: [log_001] [log_002] [log_003]',
      clear: 'clear',
      system: 'StellarFlux OS v0.1.0 | Stable | 8GB RAM | All systems nominal',
      echo: (args) => args || '',
    };

    let response = '';
    if (responses[trimmed]) {
      response = typeof responses[trimmed] === 'function' ? responses[trimmed](trimmed.split(' ')[1]) : responses[trimmed];
    } else if (trimmed.startsWith('echo ')) {
      response = trimmed.slice(5);
    } else {
      response = `command not found: ${trimmed}`;
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
          <div key={i} className={line.startsWith('>') ? 'text-cyan-300' : 'text-slate-300'}>
            {line}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-cyan-500/10 pt-2">
        <span className="text-cyan-400">{'>'}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
          className="flex-1 bg-transparent outline-none text-cyan-300 font-mono placeholder-slate-500"
          placeholder="type command..."
          autoFocus
        />
      </div>
    </div>
  );
}
