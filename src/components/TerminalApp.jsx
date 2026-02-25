import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { saveTerminalHistory, loadTerminalHistory, saveTerminalOutput, loadTerminalOutput } from '../utils/storage';

// yo this is the terminal with xterm integration
// handles commands like help, scan, readlog, and the secret stellar-key command
export default function TerminalApp({ onUnlock, onGameWin }) {
  const terminalRef = useRef(null);
  const termRef = useRef(null);
  const fitAddonRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // sample logs data - in real scenario would load from json files
  const logsDatabase = [
    { id: 'log_001', title: 'System Boot Log', content: 'SYSTEM INITIATED\n> Checking core systems...\n> All checks passed. Welcome, operator.' },
    { id: 'log_002', title: 'Network Trace', content: 'NETWORK ANALYSIS\n> Ping response: 4ms\n> Signal strength: 99%\n> Encryption: AES-256' },
    { id: 'log_003', title: 'Memory Dump', content: 'MEMORY STATUS\n> Allocated: 8.2GB / 16GB\n> Cache hit rate: 94.2%\n> No anomalies detected' },
  ];

  // initialize xterm on mount
  useEffect(() => {
    if (terminalRef.current && !termRef.current) {
      const term = new Terminal({
        theme: {
          background: '#050812',
          foreground: '#e0e0e0',
          cursor: '#00d4ff',
          selection: 'rgba(0, 212, 255, 0.2)',
        },
        fontFamily: '"Space Mono", monospace',
        fontSize: 13,
        lineHeight: 1.4,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);

      // load previous output
      loadTerminalOutput().then((output) => {
        if (output) {
          term.write(output);
        } else {
          term.writeln('StellarFlux OS v0.1.0');
          term.writeln('type "help" for available commands\n');
        }
      });

      // load history from storage
      loadTerminalHistory().then((hist) => {
        setHistory(hist);
      });

      fitAddon.fit();
      termRef.current = term;
      fitAddonRef.current = fitAddon;

      // command handling
      let currentInput = '';
      term.onData((data) => {
        if (data === '\r') {
          // enter key - execute command
          term.writeln('');
          handleCommand(currentInput, term);
          saveTerminalOutput(termRef.current.buffer.active.getLine(0)?.translateToString(true) || '');
          currentInput = '';
        } else if (data === '\u007F') {
          // backspace
          if (currentInput.length > 0) {
            currentInput = currentInput.slice(0, -1);
            term.write('\u0008 \u0008');
          }
        } else if (data === '\u001b[A') {
          // up arrow - history
          if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            const cmd = history[history.length - 1 - newIndex];
            if (cmd) {
              term.write('\u001b[2K\r> ');
              term.write(cmd);
              currentInput = cmd;
            }
          }
        } else if (data === '\u001b[B') {
          // down arrow - history
          if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            const cmd = history[history.length - 1 - newIndex];
            term.write('\u001b[2K\r> ');
            term.write(cmd);
            currentInput = cmd;
          }
        } else if (data.charCodeAt(0) >= 32 && data.charCodeAt(0) <= 126) {
          // printable chars
          currentInput += data;
          term.write(data);
        }
      });

      async function handleCommand(input, terminal) {
        const trimmed = input.trim();
        const parts = trimmed.split(' ');
        const cmd = parts[0].toLowerCase();

        terminal.write(`\r\n\x1b[36m> ${input}\x1b[0m\n`);

        let newHistory = [...history, trimmed];
        setHistory(newHistory);
        setHistoryIndex(-1);
        await saveTerminalHistory(newHistory);

        switch (cmd) {
          case 'help':
            terminal.writeln('\navailable commands:');
            terminal.writeln('  \x1b[33mhelp\x1b[0m           - shows this menu');
            terminal.writeln('  \x1b[33mscan\x1b[0m           - list available logs');
            terminal.writeln('  \x1b[33mreadlog <id>\x1b[0m   - read a log by id');
            terminal.writeln('  \x1b[33mclear\x1b[0m          - clear terminal');
            terminal.writeln('  \x1b[33mstellar-key\x1b[0m    - unlock secret');
            break;

          case 'scan':
            terminal.writeln('\navailable logs:');
            logsDatabase.forEach((log) => {
              terminal.writeln(`  ${log.id.padEnd(15)} - ${log.title}`);
            });
            break;

          case 'readlog':
            if (parts.length < 2) {
              terminal.writeln('\n\x1b[31merror: missing log id\x1b[0m');
              break;
            }
            const logId = parts[1];
            const log = logsDatabase.find((l) => l.id === logId);
            if (!log) {
              terminal.writeln(`\n\x1b[31merror: log "${logId}" not found\x1b[0m`);
            } else {
              terminal.writeln('\n' + log.content);
            }
            break;

          case 'stellar-key':
            terminal.writeln('\n\x1b[32m✓ SECRET UNLOCKED\x1b[0m');
            terminal.writeln('accessing hidden subroutine...\n');
            if (onUnlock) {
              onUnlock('secretRoom');
            }
            break;

          case 'clear':
            terminal.clear();
            break;

          default:
            if (trimmed.length > 0) {
              terminal.writeln(`\x1b[31m✗ command not recognized: "${cmd}"\x1b[0m`);
            }
        }

        terminal.write('\r\n\x1b[36m>\x1b[0m ');
      }

      // initial prompt
      term.write('\r> ');
    }

    // cleanup on unmount
    return () => {
      if (termRef.current) {
        termRef.current.dispose();
        termRef.current = null;
      }
    };
  }, [history, historyIndex, onUnlock]);

  return (
    <div ref={terminalRef} style={{ width: '100%', height: '100%' }}></div>
  );
}
