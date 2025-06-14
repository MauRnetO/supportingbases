import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Layout from "../components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (!data.session && router.pathname !== "/login" && router.pathname !== "/register") {
        router.push("/login");
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push("/login");
      else setAuthenticated(true);
    });
  }, []);

  if (loading) return <p className="p-4">Carregando...</p>;

  if (router.pathname === "/login" || router.pathname === "/register") {
    return <Component {...pageProps} />;
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}