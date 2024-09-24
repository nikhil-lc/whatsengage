// utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Set up your Supabase URL and API key in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;