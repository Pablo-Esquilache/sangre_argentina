const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const SUPABASE_URL = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const SUPABASE_ANON_KEY = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function signUp() {
  const { data, error } = await supabase.auth.signUp({
    email: 'rodrigomigueles1@gmail.com',
    password: 'sangreargentina',
  });
  console.log('Signup result:', error ? error.message : 'Success!');
}
signUp();
