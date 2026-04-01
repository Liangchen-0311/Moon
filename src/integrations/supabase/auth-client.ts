import { createClient } from '@supabase/supabase-js';

// Direct connection to user's own Supabase instance for auth
// This bypasses Lovable Cloud's auth proxy so custom SMTP and email templates work
const SUPABASE_URL = 'https://qlcsjucbgivlaafznuez.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsY3NqdWNiZ2l2bGFhZnpudWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjE3NzksImV4cCI6MjA4OTgzNzc3OX0.Lrd8Wx1Y3kvCw4Sqt4BGsWjV41oHcAFp8jeoQX1rLlk';

export const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
