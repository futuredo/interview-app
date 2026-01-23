import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase 环境变量缺失，请检查 .env 配置。');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
