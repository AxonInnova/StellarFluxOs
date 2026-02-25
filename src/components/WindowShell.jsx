import { Rnd } from 'react-rnd';
import { useEffect, useState } from 'react';

// bruh this handles all the window container stuff
// draggable, resizable, focus management, the whole thing
export default function WindowShell({
  id,
  title,
  children,
  onClose,
  onFocus,
  zIndex,
  initialX,
  initialY,
  initialWidth,
  initialHeight,
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
    onFocus(id);
  };

  const handleDragStop = () => {
    setIsDragging(false);
  };

  return (
    <Rnd
      default={{
        x: initialX || Math.random() * 100,
        y: initialY || Math.random() * 100,
        width: initialWidth || 600,
        height: initialHeight || 400,
      }}
      minWidth={300}
      minHeight={200}
      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      onMouseDown={() => onFocus(id)}
      style={{
        zIndex,
        fontSize: '14px',
      }}
    >
      <div
        className={`
          flex flex-col h-full rounded-lg border border-stellar-accent/20 bg-gradient-to-br from-stellar-dark/90 to-stellar-darker/95 backdrop-blur-sm
          ${isDragging ? 'window-focused' : ''}
          shadow-xl window-transition
        `}
      >
        {/* title bar */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-stellar-accent/10 bg-stellar-darker/50 cursor-move rounded-t-lg"
          onMouseDown={() => onFocus(id)}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-stellar-accent/50"></div>
            <span className="font-mono text-sm font-semibold text-stellar-accent">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="text-stellar-danger hover:text-stellar-danger/80 transition text-lg font-bold"
            title="Close (Esc)"
          >
            ×
          </button>
        </div>

        {/* content */}
        <div
          className="flex-1 overflow-auto p-4"
          onMouseDown={() => onFocus(id)}
        >
          {children}
        </div>
      </div>
    </Rnd>
  );
}
