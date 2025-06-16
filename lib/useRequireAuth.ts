import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "./useAuth";

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  return { user, loading };
}