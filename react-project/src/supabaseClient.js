import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://urumcptjucxdcmugsmge.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVydW1jcHRqdWN4ZGNtdWdzbWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI4Nzc4NTAsImV4cCI6MTk5ODQ1Mzg1MH0.oKVtuJW3AteZM10qhl1zK7_dLslTE2nfDUh-EZPd0Ns';

export const supabase = createClient(supabaseUrl, supabaseKey);
