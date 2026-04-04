"use client"

import { SupabaseClient } from "@supabase/supabase-js"
import { env, hasSupabaseEnv } from "../env";
import { createBrowserClient } from "@supabase/ssr";

let browserClient: SupabaseClient | null = null;

export function createBrowserSupabaseClient() {
    if (!hasSupabaseEnv){
        return null
    }

    if(!browserClient){
        browserClient = createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
    }
    return browserClient    
}