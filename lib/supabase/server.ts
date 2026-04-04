import { cookies } from "next/headers";
import { env } from "../env";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export function createServerSupabaseClient() {
    const cookieStore = cookies();

    return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
        cookies: {
            get(name: string) {
                return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
                try {
                    cookieStore.set({name, value,... options});
                } catch (error) {
                    console.error("Error setting cookie:", error);
                }
            },
            remove(name: string, options: CookieOptions) {
                try {
                    cookieStore.set({name, value: "", ...options});
                } catch (error) {
                    console.error("Error removing cookie:", error);
                }
            },
        },
    })

}