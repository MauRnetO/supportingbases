
import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/router";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.signOut().then(() => {
      router.replace("/Login");
    });
  }, [router]);

  return <p className="p-4">Saindo...</p>;
}
