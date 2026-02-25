import { useEffect, useState } from 'react';
import { saveNotepadContent, loadNotepadContent } from '../utils/storage';

// simple notepad fr fr
// autosaves to localforage so ur notes stick around
export default function Notepad() {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // load from storage on mount
  useEffect(() => {
    loadNotepadContent().then((loaded) => {
      setContent(loaded);
    });
  }, []);

  // autosave whenever content changes
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (content.length > 0) {
        setIsSaving(true);
        await saveNotepadContent(content);
        setIsSaving(false);
      }
    }, 1000); // wait 1s after last keystroke before saving

    return () => clearTimeout(timeout);
  }, [content]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-3 py-2 border-b border-stellar-accent/10 text-xs text-stellar-accent/70">
        <span>untitled.txt</span>
        {isSaving && <span className="text-stellar-success">saving...</span>}
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 p-4 bg-stellar-darker/20 text-stellar-accent/90 font-mono text-sm focus:outline-none resize-none"
        placeholder="start typing... everything auto-saves"
        spellCheck="false"
      />
    </div>
  );
}
