import { useState, useRef, useEffect } from 'react';

export default function Window({
  id,
  title,
  children,
  zIndex,
  minimized,
  onClose,
  onMinimize,
  onFocus,
  onMove,
  position,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef(null);

  const handleMouseDown = (e) => {
    onFocus();
    if (e.target.closest('button')) return;
    
    setIsDragging(true);
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      onMove({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onMove]);

  return (
    <div
      ref={windowRef}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex,
        userSelect: isDragging ? 'none' : 'auto',
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      className="w-[600px] h-[400px] rounded-lg shadow-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-cyan-500/20 flex flex-col"
    >
      <div
        onMouseDown={handleMouseDown}
        className="h-10 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-cyan-500/10 rounded-t-lg flex items-center justify-between px-4 cursor-grab active:cursor-grabbing hover:from-slate-700 hover:to-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400/60"></div>
          <span className="font-mono text-xs font-semibold text-cyan-300">{title}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onMinimize}
            className="w-6 h-6 flex items-center justify-center hover:bg-blue-500/20 rounded transition text-cyan-300 text-xs"
            title="Minimize"
          >
            _
          </button>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center hover:bg-red-500/20 rounded transition text-cyan-300 text-xs"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-950/40 p-4 text-slate-200 font-mono text-sm">
        {minimized ? (
          <div className="text-cyan-400/50 text-center py-8">window minimized</div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
