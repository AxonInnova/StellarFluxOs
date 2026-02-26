import { useState } from 'react';

export default function Notepad() {
  const [content, setContent] = useState('# StellarFlux Notes\n\nWelcome to the notepad.\nType freely here.');

  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-xs text-slate-500 mb-2">untitled.md</div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 bg-transparent outline-none text-slate-200 font-mono text-sm resize-none p-0"
        placeholder="start typing..."
        spellCheck="false"
      />
    </div>
  );
}
