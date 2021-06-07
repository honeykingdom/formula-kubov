import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  typeof window === 'undefined'
    ? process.env.SUPABASE_API_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default supabase;
