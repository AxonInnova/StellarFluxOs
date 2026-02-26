import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// fr fr this is the gateway to everything
// no cap - without this the whole app is mid
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ SUPABASE CONFIG MISSING');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓ loaded' : '✗ missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ loaded' : '✗ missing');
  console.error('Check your .env.local file fr');
}

console.log('🚀 Supabase connecting to:', supabaseUrl?.split('.supabase.co')[0] + '.supabase.co');

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export const getSupabaseClient = () => supabase;

export default supabase;
