import { useState } from 'react';
import { signInWithEmail, signUpWithEmail, signInAsGuest } from '../lib/auth';

export default function Login({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = isSignUp
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // call parent callback - they handle the auth state update
      onAuthSuccess(result.user);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGuestClick = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInAsGuest();

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // guest vibes - just go fr
      onAuthSuccess(result.user, true);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 flex items-center justify-center overflow-hidden">
      {/* nebula bg animation - the vibe setter */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ top: '10%', left: '10%', animationDuration: '4s' }} />
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ top: '60%', right: '10%', animationDuration: '6s' }} />
      </div>

      {/* main container */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* logo area */}
        <div className="text-center mb-12">
          <div className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
            ⧆ StellarFlux OS
          </div>
          <p className="text-slate-400 text-sm font-mono">// welcome to the vortex</p>
        </div>

        {/* glass card */}
        <div className="backdrop-blur-xl bg-slate-800/40 border border-cyan-500/20 rounded-lg p-8 shadow-2xl">
          <h2 className="text-xl font-mono font-bold text-cyan-300 mb-6 text-center">
            {isSignUp ? '// CREATE ACCOUNT' : '// ACCESS TERMINAL'}
          </h2>

          {/* error display */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded text-red-300 text-sm font-mono">
              ✕ {error}
            </div>
          )}

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-2">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-950/50 border border-cyan-500/20 rounded px-4 py-2 text-slate-200 font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-2">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/50 border border-cyan-500/20 rounded px-4 py-2 text-slate-200 font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 hover:from-cyan-500/40 hover:to-blue-500/40 disabled:opacity-50 border border-cyan-400/40 rounded py-2 font-mono text-sm text-cyan-300 transition"
            >
              {loading ? '⟳ processing...' : isSignUp ? '→ REGISTER' : '→ SIGN IN'}
            </button>
          </form>

          {/* toggle signup/signin */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-xs font-mono text-slate-400 hover:text-cyan-400 transition"
            >
              {isSignUp ? 'already got an account? // sign in' : "new here? // create account"}
            </button>
          </div>

          {/* divider */}
          <div className="my-6 flex items-center gap-2">
            <div className="h-px bg-cyan-500/10 flex-1" />
            <span className="text-xs text-slate-500 font-mono">or</span>
            <div className="h-px bg-cyan-500/10 flex-1" />
          </div>

          {/* guest button - no cap best feature */}
          <button
            onClick={handleGuestClick}
            disabled={loading}
            className="w-full bg-slate-700/30 hover:bg-slate-700/50 disabled:opacity-50 border border-slate-500/30 rounded py-2 font-mono text-sm text-slate-300 transition"
          >
            {loading ? '⟳ processing...' : '👤 GUEST DEMO'}
          </button>
        </div>

        {/* footer text */}
        <div className="text-center mt-8 text-xs font-mono text-slate-500">
          // alpha v0.1.0 | deep-space workstation
        </div>
      </div>
    </div>
  );
}
