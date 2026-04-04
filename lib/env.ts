export const env = {
    databaseUrl: process.env.DATABASE_URL!,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
}

export const hasSupabaseEnv = Boolean(env.supabaseUrl && env.supabaseAnonKey);

export const assertSupabaseEnv = () => {
    if (!hasSupabaseEnv) {
        throw new Error("Missing Supabase environment variables. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.");
    }
}