import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

// phaser 3 mini-game embedded in a window
// simple node connection puzzle - 60 second time limit
// win = CODE-42-STAR returned to callback
export default function GameApp({ onGameWin }) {
  const gameRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (!gameStarted) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          setGameStarted(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameStarted]);

  const startGame = () => {
    setTimeLeft(60);
    setGameStarted(true);
    setWon(false);

    // create phaser game
    const config = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } },
      },
      scene: {
        create: (scene) => {
          const width = scene.sys.game.config.width;
          const height = scene.sys.game.config.height;

          // create player circle
          const player = scene.add.circle(width / 2 - 80, height / 2, 15, 0x00d4ff);
          player.depth = 10;

          // create target circles
          const targets = [
            { x: width / 2 + 80, y: height / 2, color: 0xa855f7 },
            { x: width / 2, y: height / 2 - 60, color: 0x00ff88 },
            { x: width / 2, y: height / 2 + 60, color: 0xff006e },
          ];

          targets.forEach((target) => {
            scene.add.circle(target.x, target.y, 12, target.color);
          });

          // simple click to win logic
          let connected = 0;
          scene.input.on('pointerdown', (pointer) => {
            targets.forEach((target) => {
              const dist = Phaser.Math.Distance.Between(
                pointer.x,
                pointer.y,
                target.x,
                target.y
              );
              if (dist < 20) {
                connected++;
                if (connected === 3) {
                  // all nodes connected!
                  setWon(true);
                  setGameStarted(false);
                  if (onGameWin) {
                    onGameWin('CODE-42-STAR');
                  }
                  scene.physics.pause();
                }
              }
            });
          });
        },
      },
    };

    new Phaser.Game(config);
  };

  useEffect(() => {
    return () => {
      if (window.phaserGames) {
        window.phaserGames.forEach((game) => game.destroy(true));
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full items-center justify-center gap-4">
      {!gameStarted && !won && (
        <div className="text-center">
          <div className="text-2xl font-bold text-stellar-accent mb-2">Node Connect</div>
          <div className="text-sm text-stellar-accent/70 mb-4">connect the nodes in 60 seconds</div>
          <button
            onClick={startGame}
            className="px-4 py-2 bg-stellar-secondary/20 hover:bg-stellar-secondary/40 text-stellar-secondary border border-stellar-secondary/50 rounded transition"
          >
            Start
          </button>
        </div>
      )}

      {gameStarted && (
        <div className="w-full text-center">
          <div className="text-3xl font-mono font-bold text-stellar-accent mb-4">{timeLeft}s</div>
          <div ref={gameRef} style={{ width: '100%', height: '300px' }} />
        </div>
      )}

      {won && (
        <div className="text-center">
          <div className="text-2xl font-bold text-stellar-success mb-2">✓ Victory!</div>
          <div className="text-sm text-stellar-accent/70 mb-4">code unlocked: CODE-42-STAR</div>
          <button
            onClick={startGame}
            className="px-4 py-2 bg-stellar-success/20 hover:bg-stellar-success/40 text-stellar-success border border-stellar-success/50 rounded transition"
          >
            Play Again
          </button>
        </div>
      )}

      {!gameStarted && !won && timeLeft === 0 && (
        <div className="text-center">
          <div className="text-2xl font-bold text-stellar-danger mb-2">Time Up</div>
          <button onClick={startGame} className="px-4 py-2 bg-stellar-danger/20 text-stellar-danger border border-stellar-danger/50 rounded hover:bg-stellar-danger/40 transition">
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
