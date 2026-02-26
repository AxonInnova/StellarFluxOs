import { useState } from 'react';

export default function Game() {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);

  const handleStart = () => {
    setStarted(true);
    setScore(0);
  };

  const handleGameAction = () => {
    setScore((s) => s + 1);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {!started ? (
        <div className="text-center space-y-4">
          <div className="text-lg font-mono text-cyan-300">Node Connection Game</div>
          <div className="text-sm text-slate-400">Connect the nodes to score points</div>
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 rounded hover:bg-cyan-500/30 transition"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="text-sm text-slate-400">Score: {score}</div>
          <div className="flex gap-3">
            <button
              onClick={handleGameAction}
              className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-400/40 hover:from-cyan-500/40 hover:to-blue-500/40 transition"
            >
              ◆
            </button>
            <button
              onClick={handleGameAction}
              className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-400/40 hover:from-purple-500/40 hover:to-pink-500/40 transition"
            >
              ◆
            </button>
            <button
              onClick={handleGameAction}
              className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border border-blue-400/40 hover:from-blue-500/40 hover:to-cyan-500/40 transition"
            >
              ◆
            </button>
          </div>
          <button onClick={() => setStarted(false)} className="text-xs text-slate-500 hover:text-slate-400">
            back
          </button>
        </div>
      )}
    </div>
  );
}
