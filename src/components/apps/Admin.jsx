import { useState } from 'react';
import { adminResetUserStorage } from '../../lib/storage';

// admin panel - debug & system tools fr
// only visible to admins no cap
export default function AdminPanel({ userId, userEmail, isAdmin }) {
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState('');

  if (!isAdmin) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 font-mono">
        // access denied - admin only
      </div>
    );
  }

  const handleResetStorage = async () => {
    if (!confirm('🚨 RESET ALL USER FILES? // this deletes everything fr')) return;

    setResetting(true);
    const result = await adminResetUserStorage(userId);

    if (result.success) {
      setMessage('✓ storage reset complete');
    } else {
      setMessage(`✕ error: ${result.error}`);
    }

    setResetting(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="w-full h-full flex flex-col p-4 space-y-4">
      <div className="text-xs font-mono text-yellow-400 mb-4">⚙ ADMIN PANEL</div>

      {/* message display */}
      {message && (
        <div className={`text-xs font-mono p-2 rounded ${message.includes('✓') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
          {message}
        </div>
      )}

      {/* user info */}
      <div className="bg-slate-900/30 border border-cyan-500/10 rounded p-3 space-y-2">
        <div className="text-xs text-slate-500 font-mono">USER INFO</div>
        <div className="text-xs font-mono text-slate-300">
          email: {userEmail}
          <br />
          id: {userId.substring(0, 8)}...
        </div>
      </div>

      {/* debug functions */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        <div className="text-xs text-slate-500 font-mono">DEBUG TOOLS</div>

        <button
          onClick={handleResetStorage}
          disabled={resetting}
          className="w-full px-3 py-2 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 border border-red-500/30 rounded text-xs font-mono text-red-300 transition"
        >
          {resetting ? '⟳ processing...' : '🗑 RESET STORAGE'}
        </button>

        <div className="text-xs text-slate-500 font-mono p-2 bg-slate-900/30 rounded border border-cyan-500/10">
          // resets all uploaded files & storage usage // cannot undo
        </div>
      </div>

      {/* system info */}
      <div className="bg-slate-900/30 border border-cyan-500/10 rounded p-3 space-y-1">
        <div className="text-xs text-slate-500 font-mono">SYSTEM</div>
        <div className="text-xs font-mono text-slate-400">
          node_env: {import.meta.env.MODE}
          <br />
          admin_email: {import.meta.env.VITE_ADMIN_EMAIL}
        </div>
      </div>
    </div>
  );
}
