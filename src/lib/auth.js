import { supabase } from './supabase';

// auth fr - handles the whole login/signup vibe
// keep it clean, keep it secure

export const signUpWithEmail = async (email, password) => {
  try {
    console.log('📝 attempting signup for:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}`,
      },
    });

    if (error) {
      console.error('❌ signup error:', error);
      throw error;
    }
    
    console.log('✓ signup success:', data.user?.id);
    return { user: data.user, error: null };
  } catch (err) {
    const errorMsg = err?.message || err?.toString() || 'unknown error fr';
    console.error('signup error fr:', errorMsg);
    return { user: null, error: errorMsg };
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    console.log('🔓 attempting signin for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ signin error:', error);
      throw error;
    }
    
    console.log('✓ signin success:', data.user?.id);
    return { user: data.user, error: null };
  } catch (err) {
    const errorMsg = err?.message || err?.toString() || 'unknown error fr';
    console.error('signin error:', errorMsg);
    return { user: null, error: errorMsg };
  }
};

// guest vibes - throwaway session no cap
export const signInAsGuest = async () => {
  try {
    console.log('👤 attempting guest signup');
    const guestEmail = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@guest.local`;
    const guestPassword = Math.random().toString(36).substr(2, 12);

    const { data, error } = await supabase.auth.signUp({
      email: guestEmail,
      password: guestPassword,
      options: {
        data: { is_guest: true },
      },
    });

    if (error && error.message !== 'User already registered') {
      console.error('❌ guest signup error:', error);
      throw error;
    }

    // auto sign in
    console.log('🔓 attempting guest signin');
    const signInResult = await supabase.auth.signInWithPassword({
      email: guestEmail,
      password: guestPassword,
    });

    if (signInResult.error) {
      console.error('❌ guest signin error:', signInResult.error);
      throw signInResult.error;
    }

    console.log('✓ guest signin success:', signInResult.data.user?.id);
    return { user: signInResult.data.user, error: null, isGuest: true };
  } catch (err) {
    const errorMsg = err?.message || err?.toString() || 'unknown error fr';
    console.error('guest signup error:', errorMsg);
    return { user: null, error: errorMsg, isGuest: true };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error('signout error:', err);
    return { error: err.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.error('get current user error:', err);
    return null;
  }
};

// ensure user profile exists - no cap this is essential
export const ensureProfile = async (userId, email) => {
  try {
    // check if profile exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (existing) return existing;

    // create new profile
    const { data, error } = await supabase.from('profiles').insert({
      id: userId,
      email,
      created_at: new Date(),
    }).select().single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('profile error:', err);
    return null;
  }
};

export const getProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('get profile error:', err);
    return null;
  }
};

// save device specs to profile - only if consent given fr
export const updateDeviceSpecs = async (userId, specs) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ device_specs: specs })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('update device specs error:', err);
    return null;
  }
};
