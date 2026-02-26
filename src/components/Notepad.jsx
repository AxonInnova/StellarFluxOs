import { useEffect, useState, useRef, useCallback } from 'react';
import { saveNotepadContent, loadNotepadContent } from '../utils/storage';

export default function Notepad() {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      loadNotepadContent().then((loaded) => {
        if (loaded) {
          setContent(loaded);
        }
      });
    }
  }, []);

  const handleChange = useCallback((e) => {
    const newContent = e.target.value;
    setContent(newContent);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSaving(true);
    saveTimeoutRef.current = setTimeout(async () => {
      await saveNotepadContent(newContent);
      setIsSaving(false);
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-3 py-2 border-b border-stellar-accent/10 text-xs text-stellar-accent/70">
        <span>untitled.txt</span>
        {isSaving && <span className="text-stellar-success">Saving...</span>}
      </div>
      <textarea
        value={content}
        onChange={handleChange}
        className="flex-1 p-4 bg-stellar-darker/20 text-stellar-accent/90 font-mono text-sm focus:outline-none resize-none"
        placeholder="Start typing..."
        spellCheck="false"
      />
    </div>
  );
}
