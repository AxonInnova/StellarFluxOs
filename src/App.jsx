import { useState, useCallback, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { ensureProfile, updateDeviceSpecs, getProfile } from './lib/auth';
import Login from './components/Login';
import Dock from './components/Dock';
import Desktop from './components/Desktop';
import DeviceConsentModal from './components/DeviceConsentModal';

// central os engine - this is where the magic lives fr
// DO NOT TOUCH THE WINDOW LOGIC
export default function App() {
  // auth state - the gateway fr
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // device consent state - gotta ask permission no cap
  const [showDeviceConsent, setShowDeviceConsent] = useState(false);
  const [deviceSpecs, setDeviceSpecs] = useState(null);
  const [hasAskedConsent, setHasAskedConsent] = useState(false);

  // window manager state - centralized fr
  const [windows, setWindows] = useState({});
  const [zOrder, setZOrder] = useState([]);
  const [minimized, setMinimized] = useState(new Set());

  // check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          // ensure profile exists
          const prof = await ensureProfile(session.user.id, session.user.email);
          setProfile(prof);
          
          // check if they've already consented to device specs
          if (prof?.device_specs) {
            setDeviceSpecs(prof.device_specs);
          } else if (!hasAskedConsent) {
            // ask for consent on first login
            setShowDeviceConsent(true);
            setHasAskedConsent(true);
          }
        }
      } catch (err) {
        console.error('auth check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // listen for auth changes - real time vibes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const prof = await ensureProfile(session.user.id, session.user.email);
          setProfile(prof);
          if (prof?.device_specs) {
            setDeviceSpecs(prof.device_specs);
          }
        } else {
          setUser(null);
          setProfile(null);
          setDeviceSpecs(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe?.();
    };
  }, [hasAskedConsent]);

  // device consent handlers
  const handleDeviceConsent = async (specs) => {
    if (user && profile) {
      const updated = await updateDeviceSpecs(user.id, specs);
      if (updated) {
        setDeviceSpecs(specs);
        setProfile(updated);
      }
    }
    setShowDeviceConsent(false);
  };

  const handleDeviceDeny = () => {
    setShowDeviceConsent(false);
    // they said no - respect that fr
  };

  // handle login
  const handleAuthSuccess = async (authUser, isGuest) => {
    setUser(authUser);
    const prof = await ensureProfile(authUser.id, authUser.email);
    setProfile(prof);

    if (isGuest) {
      // guest don't need consent vibes
      setHasAskedConsent(true);
    } else if (!prof?.device_specs && !hasAskedConsent) {
      setShowDeviceConsent(true);
      setHasAskedConsent(true);
    }
  };

  // window manager functions - CENTRALIZED NO CAP
  const openWindow = useCallback(
    (appId) => {
      setWindows((prev) => {
        if (prev[appId]) {
          // already open - bring to front
          setZOrder((z) => {
            const filtered = z.filter((id) => id !== appId);
            return [...filtered, appId];
          });
          setMinimized((m) => {
            const next = new Set(m);
            next.delete(appId);
            return next;
          });
          return prev;
        }
        // new window
        return {
          ...prev,
          [appId]: {
            position: { x: 100 + Math.random() * 50, y: 100 + Math.random() * 50 },
            size: { w: 600, h: 400 },
          },
        };
      });

      if (!windows[appId] || minimized.has(appId)) {
        setZOrder((z) => [...z.filter((id) => id !== appId), appId]);
        setMinimized((m) => {
          const next = new Set(m);
          next.delete(appId);
          return next;
        });
      }
    },
    [windows, minimized]
  );

  const closeWindow = useCallback((appId) => {
    setWindows((prev) => {
      const next = { ...prev };
      delete next[appId];
      return next;
    });
    setZOrder((z) => z.filter((id) => id !== appId));
    setMinimized((m) => {
      const next = new Set(m);
      next.delete(appId);
      return next;
    });
  }, []);

  const minimizeWindow = useCallback((appId) => {
    setMinimized((m) => {
      const next = new Set(m);
      if (next.has(appId)) {
        next.delete(appId);
        setZOrder((z) => [...z.filter((id) => id !== appId), appId]);
      } else {
        next.add(appId);
      }
      return next;
    });
  }, []);

  const focusWindow = useCallback((appId) => {
    setZOrder((z) => {
      const filtered = z.filter((id) => id !== appId);
      return [...filtered, appId];
    });
    setMinimized((m) => {
      const next = new Set(m);
      next.delete(appId);
      return next;
    });
  }, []);

  const moveWindow = useCallback(
    (appId, position) => {
      setWindows((prev) => ({
        ...prev,
        [appId]: { ...prev[appId], position },
      }));
    },
    []
  );

  const resizeWindow = useCallback((appId, size) => {
    setWindows((prev) => ({
      ...prev,
      [appId]: { ...prev[appId], size },
    }));
  }, []);

  // check if user is admin - admin mode activated fr
  const isAdmin =
    user && (user.email === import.meta.env.VITE_ADMIN_EMAIL || import.meta.env.MODE !== 'production');

  // app list - conditionally add admin app fr
  const appList = ['terminal', 'notepad', 'logs', 'game', 'files'];
  if (isAdmin) appList.push('admin');

  // loading state
  if (loading) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 flex items-center justify-center">
        <div className="text-cyan-300 font-mono text-sm">⟳ booting os...</div>
      </div>
    );
  }

  // not auth - show login fr
  if (!user) {
    return <Login onAuthSuccess={handleAuthSuccess} />;
  }

  // device consent modal
  if (showDeviceConsent) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 flex">
        <Dock apps={appList} onAppClick={openWindow} openWindows={Object.keys(windows)} user={user} />
        <Desktop
          windows={windows}
          zOrder={zOrder}
          minimized={minimized}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          onResize={resizeWindow}
          userId={user.id}
          userEmail={user.email}
          deviceSpecs={deviceSpecs}
          isAdmin={isAdmin}
        />
        <DeviceConsentModal onConsent={handleDeviceConsent} onDeny={handleDeviceDeny} />
      </div>
    );
  }

  // authenticated - show desktop fr
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 overflow-hidden flex">
      {/* nebula background particles - the vibe setter fr */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ top: '10%', left: '5%', animationDuration: '8s' }} />
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ bottom: '10%', right: '5%', animationDuration: '10s' }} />
      </div>

      <Dock apps={appList} onAppClick={openWindow} openWindows={Object.keys(windows)} user={user} />
      <Desktop
        windows={windows}
        zOrder={zOrder}
        minimized={minimized}
        onClose={closeWindow}
        onMinimize={minimizeWindow}
        onFocus={focusWindow}
        onMove={moveWindow}
        onResize={resizeWindow}
        userId={user.id}
        userEmail={user.email}
        deviceSpecs={deviceSpecs}
        isAdmin={isAdmin}
      />
    </div>
  );
}
