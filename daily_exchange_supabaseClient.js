const supabaseUrl = 'https://pjlouvsxymvfdmkdyupy.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqbG91dnN4eW12ZmRta2R5dXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzMDAzMjQsImV4cCI6MjA0OTg3NjMyNH0.JPZZqEQPB5KHUv81D9sLH08ikjDCw3ftl_hEJG1VSKA';

const daily_supabase = supabase.createClient(supabaseUrl, supabaseKey);

export default daily_supabase;