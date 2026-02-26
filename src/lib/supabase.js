import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// fr fr this is the gateway to everything
// no cap - without this the whole app is mid
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSupabaseClient = () => supabase;

export default supabase;
