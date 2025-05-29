import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://usouuhnpvcsjbwphftqd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzb3V1aG5wdmNzamJ3cGhmdHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNTg2OTcsImV4cCI6MjA2MTczNDY5N30.PqLVFuJpPvrNRxkUX0qGeyxuZrHZ0TcbGKjW0VXVxJI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
