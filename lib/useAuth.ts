
import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../supabaseClient";

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/auth/login");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) router.push("/auth/login");
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);
}
