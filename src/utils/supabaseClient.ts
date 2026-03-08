import { createClient } from '@supabase/supabase-js';

const fallbackSupabaseUrl = 'https://wstmhdmqzrxdvsilhrdo.supabase.co';
const fallbackSupabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzdG1oZG1xenJ4ZHZzaWxocmRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNzc0MjksImV4cCI6MjA4NDc1MzQyOX0.M2jWgkflO0ek9I2jn0e3aNzWaOd1XOlXmgai_FFSFGo';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? fallbackSupabaseUrl;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? fallbackSupabaseAnonKey;

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn('Supabase 环境变量缺失，已使用前端回退配置。请勿在前端使用 service_role key。');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
