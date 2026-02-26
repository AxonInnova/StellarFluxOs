import { useState } from 'react';

export default function DeviceConsentModal({ onConsent, onDeny }) {
  const [agreed, setAgreed] = useState(false);

  const handleConsent = () => {
    if (!agreed) return;
    // gather device specs fr - this is the data they consented to
    const specs = {
      userAgent: navigator.userAgent,
      hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
      deviceMemory: navigator.deviceMemory || 'unknown',
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
      },
      language: navigator.language,
      platform: navigator.platform,
    };
    onConsent(specs);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="backdrop-blur-xl bg-slate-800/80 border border-cyan-500/30 rounded-lg p-8 max-w-md mx-4 shadow-2xl">
        <h3 className="text-lg font-mono font-bold text-cyan-300 mb-4">
          ◆ DEVICE SPECS CONSENT
        </h3>

        <p className="text-sm text-slate-300 font-mono mb-6 space-y-2">
          <div>// this os wants to store your device info</div>
          <div className="text-xs text-slate-500 ml-4">→ cpu cores</div>
          <div className="text-xs text-slate-500 ml-4">→ ram size</div>
          <div className="text-xs text-slate-500 ml-4">→ screen resolution</div>
          <div className="text-xs text-slate-500 ml-4">→ browser info</div>
          <div className="mt-4 text-slate-400">// helps us optimize your experience fr</div>
        </p>

        {/* consent checkbox */}
        <label className="flex items-center gap-3 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 rounded accent-cyan-500"
          />
          <span className="text-xs font-mono text-slate-300">
            i consent to sharing device specs
          </span>
        </label>

        {/* actions */}
        <div className="flex gap-3">
          <button
            onClick={onDeny}
            className="flex-1 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/30 rounded py-2 font-mono text-xs text-slate-300 transition"
          >
            ✕ DENY
          </button>
          <button
            onClick={handleConsent}
            disabled={!agreed}
            className="flex-1 bg-cyan-500/30 hover:bg-cyan-500/40 disabled:opacity-50 border border-cyan-400/40 rounded py-2 font-mono text-xs text-cyan-300 transition"
          >
            ✓ AGREE
          </button>
        </div>
      </div>
    </div>
  );
}
