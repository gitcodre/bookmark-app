// This is used for connecting with supabase client which rewuires supabase project url and anon key
// createClient is an object that returns URl key auth state session db access
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
